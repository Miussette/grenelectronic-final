# 🔧 Fix: Índice UV con Clima

## Problema

El índice UV no se mostraba junto con los datos del clima en la página `/indice-uv`.

## Causa

En `src/pages/indice-uv.tsx`, la función `getStaticProps` intentaba hacer un fetch HTTP a la API de clima durante el build:

```typescript
const weatherResponse = await fetch(`${process.env.APP_BASE_URL}/api/weather/chile`);
```

**Problema:** Durante el build estático (`getStaticProps`), el servidor Next.js no está corriendo, por lo que no puede hacer fetch a sus propias APIs.

## Solución

En lugar de hacer un fetch HTTP, ahora importamos directamente el handler de la API y lo llamamos:

```typescript
// Importar directamente el handler de la API de clima
const weatherHandler = await import("./api/weather/chile");

// Crear objetos mock de request y response
const mockReq = { method: "GET" } as NextApiRequest;
let weatherData: WeatherRegion[] = [];

const mockRes = {
  status: (code: number) => ({
    json: (data: any) => {
      if (code === 200 && data.regions) {
        weatherData = data.regions;
      }
      return mockRes;
    },
  }),
} as any;

// Llamar al handler
await weatherHandler.default(mockReq, mockRes);
```

## Resultado

Ahora la página `/indice-uv` muestra:

✅ Índice UV por región  
✅ Datos del clima (temperatura, humedad, etc.)  
✅ Icono del clima  
✅ Descripción del clima  
✅ Sensación térmica  
✅ Temperatura mín/máx  

## Cómo Probar

1. Iniciar el servidor:
   ```bash
   npm run dev
   ```

2. Navegar a:
   ```
   http://localhost:3000/indice-uv
   ```

3. Verificar que cada región muestre:
   - Índice UV con color
   - Datos del clima con icono
   - Temperatura actual
   - Sensación térmica
   - Humedad
   - Temperaturas mín/máx

## Datos del Clima

La API de clima (`/api/weather/chile`) obtiene datos de OpenWeatherMap para las 16 regiones de Chile.

**API Key configurada:** ✅ `OPENWEATHER_API_KEY` en `.env.local`

Si la API key no está disponible o falla, la API retorna datos mock realistas.

## Archivos Modificados

- `src/pages/indice-uv.tsx` - Arreglado `getStaticProps` para importar handler directamente

## Archivos Relacionados

- `src/pages/api/weather/chile.ts` - API que obtiene datos del clima
- `public/data/uv-index.json` - Datos del índice UV por región

## Notas

- Los datos se regeneran cada hora (`revalidate: 3600`)
- Si OpenWeatherMap falla, se usan datos mock
- Los datos UV son estáticos del JSON
- Los datos del clima son dinámicos de la API

---

**Estado:** ✅ ARREGLADO  
**Fecha:** Noviembre 2025
