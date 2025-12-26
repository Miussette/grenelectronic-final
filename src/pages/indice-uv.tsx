import { GetStaticProps } from "next";
import type { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sun } from "lucide-react";

type UVRegion = {
  id: string;
  name: string;
  uvIndex: number;
  level: string;
  color: string;
  recommendation: string;
};

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
  windSpeed: number;
};

type Props = {
  lastUpdate: string;
  regions: UVRegion[];
  weather: WeatherRegion[];
};

export default function IndiceUVPage({ lastUpdate, regions, weather }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRegions = regions.filter((region) =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Combinar datos de UV y clima
  const combinedData = filteredRegions.map((region) => {
    const weatherData = weather.find((w) => w.id === region.id);
    return { ...region, weather: weatherData };
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Head>
        <title>Índice UV en Chile | Grenelectronic</title>
        <meta
          name="description"
          content="Consulta el índice de radiación UV actualizado para todas las regiones de Chile"
        />
      </Head>

      <div className="min-h-screen bg-dark text-white">
        <Navbar />

        <main className="section">
          <div className="container mx-auto max-w-7xl px-4">
            {/* Encabezado */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                <Sun className="w-8 h-8 text-primary" />
              </div>
              <h1 className="section-title">Índice UV en Chile</h1>
              <p className="sub-hero mx-auto">
                Consulta el nivel de radiación ultravioleta actualizado para cada región del país
              </p>
              <p className="text-sm text-white/60 mt-4">
                Última actualización: {formatDate(lastUpdate)}
              </p>
            </div>

            {/* Buscador */}
            <div className="max-w-md mx-auto mb-12">
              <input
                type="text"
                placeholder="Buscar región..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Leyenda */}
            <div className="card mb-8">
              <h3 className="text-lg font-bold mb-4">Niveles de Radiación UV</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#10B981" }} />
                  <span className="text-sm">Bajo (1-2)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#F59E0B" }} />
                  <span className="text-sm">Moderado (3-5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#EA580C" }} />
                  <span className="text-sm">Alto (6-7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#DC2626" }} />
                  <span className="text-sm">Muy Alto (8-10)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#9333EA" }} />
                  <span className="text-sm">Extremo (11+)</span>
                </div>
              </div>
            </div>

            {/* Grid de regiones */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {combinedData.map((region) => (
                <div
                  key={region.id}
                  className="card hover:bg-white/10 transition-colors"
                >
                  {/* Encabezado con UV */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg">{region.name}</h3>
                    <div
                      className="flex items-center justify-center w-16 h-16 rounded-xl font-bold text-2xl"
                      style={{ backgroundColor: region.color }}
                    >
                      {region.uvIndex}
                    </div>
                  </div>

                  {/* Clima */}
                  {region.weather && (
                    <div className="mb-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://openweathermap.org/img/wn/${region.weather.icon}@2x.png`}
                            alt={region.weather.description}
                            className="w-12 h-12"
                          />
                          <div>
                            <div className="text-2xl font-bold">{region.weather.temp}°C</div>
                            <div className="text-xs text-white/60 capitalize">{region.weather.description}</div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                        <div>Sensación: {region.weather.feelsLike}°C</div>
                        <div>Humedad: {region.weather.humidity}%</div>
                        <div>Min: {region.weather.tempMin}°C</div>
                        <div>Max: {region.weather.tempMax}°C</div>
                      </div>
                    </div>
                  )}

                  {/* UV Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/60">Nivel UV:</span>
                      <span
                        className="text-sm font-semibold px-2 py-1 rounded"
                        style={{ backgroundColor: `${region.color}40`, color: region.color }}
                      >
                        {region.level}
                      </span>
                    </div>
                    <p className="text-sm text-white/80">{region.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>

            {combinedData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60">No se encontraron regiones con ese nombre</p>
              </div>
            )}

            {/* Información adicional */}
            <div className="mt-8 card">
              <h3 className="text-xl font-bold mb-4">¿Qué es el Índice UV?</h3>
              <div className="space-y-3 text-white/80">
                <p>
                  El Índice UV es una medida de la intensidad de la radiación ultravioleta del sol
                  que llega a la superficie terrestre. Cuanto más alto es el índice, mayor es el
                  riesgo de daño a la piel y los ojos.
                </p>
                <p>
                  En Chile, debido a la disminución de la capa de ozono y la geografía del país,
                  los niveles de radiación UV pueden ser especialmente altos, particularmente en
                  el norte y en zonas de altura.
                </p>
                <p className="font-semibold text-primary">
                  Protégete siempre usando protector solar, lentes de sol y ropa adecuada.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const fs = await import("fs/promises");
  const path = await import("path");
  
  try {
    // Cargar datos UV del JSON
    const filePath = path.join(process.cwd(), "public", "data", "uv-index.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const uvData = JSON.parse(fileContent);

    // Importar directamente el handler de la API de clima
    const weatherHandler = await import("./api/weather/chile");
    
    // Crear objetos mock de request y response
    const mockReq = { method: "GET" } as NextApiRequest;
    let weatherData: WeatherRegion[] = [];
    
    const mockRes = {
      status: (code: number) => ({
        json: (data: { regions?: WeatherRegion[]; lastUpdate?: string }) => {
          if (code === 200 && data.regions) {
            weatherData = data.regions;
          }
          return mockRes;
        },
      }),
    } as unknown as NextApiResponse;

    // Llamar al handler
    await weatherHandler.default(mockReq, mockRes);

    return {
      props: {
        lastUpdate: uvData.lastUpdate,
        regions: uvData.regions,
        weather: weatherData,
      },
      revalidate: 3600, // Revalidar cada hora
    };
  } catch (error) {
    console.error("Error loading data:", error);
    
    return {
      props: {
        lastUpdate: new Date().toISOString(),
        regions: [],
        weather: [],
      },
      revalidate: 3600,
    };
  }
};
