import type { NextApiRequest, NextApiResponse } from "next";
import vm from "vm";

const WEATHER_URL = "https://archivos.meteochile.gob.cl/portaldmc/appdata/condicionactual.js";
const ICON_BASE_URL = "https://archivos.meteochile.gob.cl/portaldmc/localJS/img/clima/";

type WeatherRegion = {
  id: string;
  name: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number | null;
};

const OACI_TO_CITY: Record<string, string> = {
  SCAR: "Arica",
  SCDA: "Iquique",
  SCCF: "Calama",
  SCFA: "Antofagasta",
  SCAT: "Atacama",
  SCSE: "La Serena / Coquimbo",
  SCVM: "Viña del Mar / Valparaíso",
  SCRD: "La Serena / Coquimbo",
  SCSN: "San Antonio / Cartagena",
  SCEL: "Santiago (Pudahuel)",
  SCTB: "Santiago (Tobalaba)",
  SCRG: "Rancagua",
  SCIC: "Curicó",
  SCCH: "Chillán",
  SCIE: "Concepción",
  SCGE: "Los Ángeles",
  SCQP: "Temuco",
  SCVD: "Valdivia",
  SCJO: "Osorno",
  SCTE: "Puerto Montt",
  SCON: "Chiloé",
  SCTN: "Chaitén",
  SCFT: "Futaleufú",
  SCMK: "Melinka",
  SCAS: "Puerto Aysén",
  SCCY: "Coyhaique",
  SCBA: "Balmaceda",
  SCCC: "Chile Chico",
  SCHR: "Cochrane",
  SCNT: "Puerto Natales",
  SCCI: "Punta Arenas",
  SCFM: "Porvenir",
  SCGZ: "Puerto Williams",
  SCIP: "Isla de Pascua",
  SCIR: "Juan Fernández",
  SCRM: "Antártica",
  SCQN: "Santiago",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();

const parseWeatherValue = (value: string) => {
  const parts = value.split("|");
  const temp = Number(parts[6]) || 0;
  const humidity = Number(parts[9]) || 0;
  const description = parts[10] || "No disponible";
  const icon = parts[8] ? `${ICON_BASE_URL}${parts[8]}` : `${ICON_BASE_URL}despejado.png`;
  const windSpeed = parts[3] ? Math.round(Number(parts[3])) : null;

  return {
    temp: Math.round(temp),
    feelsLike: Math.round(temp),
    tempMin: Math.round(temp),
    tempMax: Math.round(temp),
    humidity,
    description,
    icon,
    windSpeed,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(WEATHER_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const script = await response.text();
    const sandbox: Record<string, unknown> = { CondicionActualMetar: {}, CondicionActualMetar_actualizado: "" };

    vm.runInNewContext(script, sandbox);

    const stations = sandbox.CondicionActualMetar as Record<string, string>;
    const lastUpdate =
      (sandbox.CondicionActualMetar_actualizado as string) || new Date().toISOString();

    const regions: WeatherRegion[] = Object.entries(stations)
      .filter(([, value]) => typeof value === "string" && value.includes("|"))
      .map(([code, value]) => {
        const name = OACI_TO_CITY[code] || code;
        const parsed = parseWeatherValue(value);

        return {
          id: slugify(name),
          name,
          ...parsed,
        };
      });

    return res.status(200).json({
      lastUpdate,
      regions,
    });
  } catch (error) {
    console.error("Error fetching weather data from MeteoChile:", error);
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
