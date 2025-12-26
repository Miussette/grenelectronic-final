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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!API_KEY || API_KEY === "TU_API_KEY_AQUI") {
    // Retornar datos de ejemplo si no hay API key
    const mockData = CHILE_REGIONS.map((region, index) => {
      // Temperatura decrece de norte a sur
      const baseTemp = 28 - (index * 1.8);
      return {
        id: region.id,
        name: region.name,
        temp: Math.round(baseTemp),
        feelsLike: Math.round(baseTemp + 2),
        tempMin: Math.round(baseTemp - 5),
        tempMax: Math.round(baseTemp + 5),
        humidity: Math.round(50 + Math.random() * 30),
        description: index < 5 ? "Despejado" : index < 10 ? "Parcialmente nublado" : "Nublado",
        icon: index < 5 ? "01d" : index < 10 ? "02d" : "03d",
        windSpeed: Math.round(10 + Math.random() * 15),
      };
    });

    return res.status(200).json({
      lastUpdate: new Date().toISOString(),
      regions: mockData,
    });
  }

  try {
    const regions = await Promise.all(
      CHILE_REGIONS.map(async (region) => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${region.lat}&lon=${region.lng}&appid=${API_KEY}&units=metric&lang=es`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          return {
            id: region.id,
            name: region.name,
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            tempMin: Math.round(data.main.temp_min),
            tempMax: Math.round(data.main.temp_max),
            humidity: data.main.humidity,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            windSpeed: Math.round(data.wind.speed * 3.6), // m/s a km/h
          };
        } catch (error) {
          console.error(`Error fetching weather for ${region.name}:`, error);
          // Retornar datos por defecto si falla
          return {
            id: region.id,
            name: region.name,
            temp: 20,
            feelsLike: 20,
            tempMin: 15,
            tempMax: 25,
            humidity: 60,
            description: "No disponible",
            icon: "01d",
            windSpeed: 10,
          };
        }
      })
    );

    return res.status(200).json({
      lastUpdate: new Date().toISOString(),
      regions,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
