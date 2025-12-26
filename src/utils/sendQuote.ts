export type QuotePayload = {
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  direccion?: string;
  rut?: string;
  categoria?: string;   // ej: “Señalética LED”
  fechaObjetivo?: string; // YYYY-MM-DD
  descripcion?: string;
  items?: { sku?: string; name: string; cantidad: number }[]; // opcional
};

const WP_ENDPOINT =
  "https://lightseagreen-tiger-127652.hostingersite.com/wp-json/grene/v1/cotizacion";

export async function sendQuote(payload: QuotePayload) {
  const res = await fetch(WP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json() as Promise<{ ok: boolean; id: number; folio: string; detail: string }>;
}
