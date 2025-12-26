import type { NextApiRequest, NextApiResponse } from "next";

// Coordenadas de las capitales regionales de Chile
const CHILE_REGIONS = [
  { id: "arica", name: "Arica y Parinacota", lat: -18.4783, lng: -70.3126 },
  { id: "tarapaca", name: "Tarapacá", lat: -20.2140, lng: -70.1522 },
  { id: "antofagasta", name: "Antofagasta", lat: -23.6509, lng: -70.3975 },
  { id: "atacama", name: "Atacama", lat: -27.3668, lng: -70.3323 },
  { id: "coquimbo", name: "Coquimbo", lat: -29.9533, lng: -71.3395 },
  { id: "valparaiso", name: "Valparaíso", lat: -33.0472, lng: -71.6127 },
  { id: "metropolitana", name: "Metropolitana", lat: -33.4489, lng: -70.6693 },
  { id: "ohiggins", name: "O'Higgins", lat: -34.1701, lng: -70.7403 },
  { id: "maule", name: "Maule", lat: -35.4264, lng: -71.6554 },
  { id: "nuble", name: "Ñuble", lat: -36.6063, lng: -72.1034 },
  { id: "biobio", name: "Biobío", lat: -36.8270, lng: -73.0498 },
  { id: "araucania", name: "La Araucanía", lat: -38.7359, lng: -72.5904 },
  { id: "rios", name: "Los Ríos", lat: -39.8142, lng: -73.2459 },
  { id: "lagos", name: "Los Lagos", lat: -41.4693, lng: -72.9424 },
  { id: "aysen", name: "Aysén", lat: -45.5752, lng: -72.0662 },
  { id: "magallanes", name: "Magallanes", lat: -53.1638, lng: -70.9171 },
];

function getUVLevel(uvIndex: number): { level: string; color: string; recommendation: string } {
  if (uvIndex <= 2) {
    return {
      level: "Bajo",
      color: "#10B981",
      recommendation: "Protección mínima requerida.",
    };
  } else if (uvIndex <= 5) {
    return {
      level: "Moderado",
      color: "#F59E0B",
      recommendation: "Usar protección solar en horas peak.",
    };
  } else if (uvIndex <= 7) {
    return {
      level: "Alto",
      color: "#EA580C",
      recommendation: "Usar protección solar. Evitar exposición prolongada.",
    };
  } else if (uvIndex <= 10) {
    return {
      level: "Muy Alto",
      color: "#DC2626",
      recommendation: "Reducir exposición al sol. Usar protección alta.",
    };
  } else {
    return {
      level: "Extremo",
      color: "#9333EA",
      recommendation: "Evitar exposición al sol. Usar protección máxima.",
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.OPENUV_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "OpenUV API key not configured" });
  }

  try {
    const regions = await Promise.all(
      CHILE_REGIONS.map(async (region) => {
        try {
          const response = await fetch(
            `https://api.openuv.io/api/v1/uv?lat=${region.lat}&lng=${region.lng}`,
            {
              headers: {
                "x-access-token": API_KEY,
              },
            }
          );

          if (!response.ok) {
            console.error(`Error fetching UV for ${region.name}:`, response.status);
            // Retornar valor por defecto si falla
            return {
              id: region.id,
              name: region.name,
              uvIndex: 5,
              ...getUVLevel(5),
            };
          }

          const data = await response.json();
          const uvIndex = Math.round(data.result.uv);
          const uvData = getUVLevel(uvIndex);

          return {
            id: region.id,
            name: region.name,
            uvIndex,
            ...uvData,
          };
        } catch (error) {
          console.error(`Error processing ${region.name}:`, error);
          // Retornar valor por defecto si falla
          return {
            id: region.id,
            name: region.name,
            uvIndex: 5,
            ...getUVLevel(5),
          };
        }
      })
    );

    return res.status(200).json({
      lastUpdate: new Date().toISOString(),
      regions,
    });
  } catch (error) {
    console.error("Error fetching UV data:", error);
    return res.status(500).json({ error: "Failed to fetch UV data" });
  }
}
