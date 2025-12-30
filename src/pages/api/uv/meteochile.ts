import type { NextApiRequest, NextApiResponse } from "next";

const METEOCHILE_UV_URL = "https://climatologia.meteochile.gob.cl/application/servicios/getRecienteUvb";

type MeteochileUVStation = {
  codigoNacional: string;
  nombreEstacion: string;
  latitud: number;
  longitud: number;
  altura: number;
  momento: string;
  uvb: number;
  region?: string;
};

type UVRegion = {
  id: string;
  name: string;
  uvIndex: number;
  level: string;
  color: string;
  recommendation: string;
  latitude: number;
  longitude: number;
  altitude: number;
  stationCode: string;
};

// Mapeo de estaciones a regiones/ciudades conocidas
const STATION_TO_REGION: Record<string, string> = {
  "330020": "Santiago",
  "330021": "Santiago (Pudahuel)",
  "180005": "Arica",
  "200006": "Iquique",
  "220002": "Antofagasta",
  "230001": "Atacama",
  "270001": "La Serena",
  "320041": "Valparaíso",
  "340031": "Rancagua",
  "360019": "Talca",
  "380013": "Chillán",
  "400006": "Concepción",
  "410005": "Temuco",
  "430009": "Valdivia",
  "450004": "Puerto Montt",
  "470001": "Coyhaique",
  "530005": "Punta Arenas",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();

const getUVLevel = (uvIndex: number): { level: string; color: string; recommendation: string } => {
  if (uvIndex <= 2) {
    return {
      level: "Bajo",
      color: "#10B981",
      recommendation: "Puedes disfrutar del sol con precauciones mínimas.",
    };
  } else if (uvIndex <= 5) {
    return {
      level: "Moderado",
      color: "#F59E0B",
      recommendation: "Usa protector solar SPF 30+, sombrero y lentes de sol.",
    };
  } else if (uvIndex <= 7) {
    return {
      level: "Alto",
      color: "#EA580C",
      recommendation: "Reduce exposición entre 10:00 y 16:00. Usa protección.",
    };
  } else if (uvIndex <= 10) {
    return {
      level: "Muy Alto",
      color: "#DC2626",
      recommendation: "Evita el sol del mediodía. Protección obligatoria.",
    };
  } else {
    return {
      level: "Extremo",
      color: "#9333EA",
      recommendation: "Evita salir. Si es necesario, protección máxima.",
    };
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const usuario = process.env.METEOCHILE_USER;
  const token = process.env.METEOCHILE_TOKEN;

  // Si no hay credenciales, retornar datos de fallback
  if (!usuario || !token) {
    console.warn("Meteochile credentials not configured, using fallback data");
    return res.status(200).json({
      lastUpdate: new Date().toISOString(),
      regions: getFallbackData(),
      source: "fallback",
      message: "Credenciales de Meteochile no configuradas. Usando datos de ejemplo.",
    });
  }

  try {
    const url = `${METEOCHILE_UV_URL}?usuario=${encodeURIComponent(usuario)}&token=${encodeURIComponent(token)}`;
    
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Procesar datos de Meteochile
    const stations: MeteochileUVStation[] = Array.isArray(data) ? data : data.datos || [];
    
    const regions: UVRegion[] = stations.map((station) => {
      const name = STATION_TO_REGION[station.codigoNacional] || station.nombreEstacion;
      const uvIndex = Math.round(station.uvb);
      const { level, color, recommendation } = getUVLevel(uvIndex);

      return {
        id: slugify(name),
        name,
        uvIndex,
        level,
        color,
        recommendation,
        latitude: station.latitud,
        longitude: station.longitud,
        altitude: station.altura,
        stationCode: station.codigoNacional,
      };
    });

    // Obtener la fecha más reciente de las estaciones
    const lastUpdate = stations.length > 0 
      ? stations.reduce((latest, station) => {
          const stationDate = new Date(station.momento);
          return stationDate > new Date(latest) ? station.momento : latest;
        }, stations[0].momento)
      : new Date().toISOString();

    return res.status(200).json({
      lastUpdate,
      regions,
      source: "meteochile",
    });
  } catch (error) {
    console.error("Error fetching UV data from Meteochile:", error);
    
    // Retornar datos de fallback en caso de error
    return res.status(200).json({
      lastUpdate: new Date().toISOString(),
      regions: getFallbackData(),
      source: "fallback",
      error: "Error al obtener datos de Meteochile. Usando datos de respaldo.",
    });
  }
}

// Datos de respaldo cuando no hay API disponible
function getFallbackData(): UVRegion[] {
  const defaultRegions = [
    { name: "Arica", uvIndex: 11 },
    { name: "Iquique", uvIndex: 10 },
    { name: "Antofagasta", uvIndex: 10 },
    { name: "Atacama", uvIndex: 9 },
    { name: "La Serena", uvIndex: 8 },
    { name: "Valparaíso", uvIndex: 7 },
    { name: "Santiago", uvIndex: 8 },
    { name: "Rancagua", uvIndex: 7 },
    { name: "Talca", uvIndex: 6 },
    { name: "Chillán", uvIndex: 6 },
    { name: "Concepción", uvIndex: 5 },
    { name: "Temuco", uvIndex: 5 },
    { name: "Valdivia", uvIndex: 4 },
    { name: "Puerto Montt", uvIndex: 4 },
    { name: "Coyhaique", uvIndex: 3 },
    { name: "Punta Arenas", uvIndex: 2 },
  ];

  return defaultRegions.map((region) => {
    const { level, color, recommendation } = getUVLevel(region.uvIndex);
    return {
      id: slugify(region.name),
      name: region.name,
      uvIndex: region.uvIndex,
      level,
      color,
      recommendation,
      latitude: 0,
      longitude: 0,
      altitude: 0,
      stationCode: "",
    };
  });
}
