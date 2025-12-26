"use client";
import Link from "next/link";

const COTIZACION_URL = "/tienda/cotizacion"; // ✅ usamos esta ruta

export default function Cotizaciones() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <div>
        <h2 className="text-3xl font-bold mb-3">Cotizaciones para tu proyecto</h2>
        <p className="text-white/80 mb-4">
          Pide una cotización para señaléticas, electrónica, ferretería, tableros y más.
          Te respondemos con alternativas y tiempos de entrega.
        </p>

        <ul className="space-y-2 mb-6 text-white/80">
          <li>• Elige productos o describe tu necesidad.</li>
          <li>• Indica medidas, cantidades y fecha objetivo.</li>
          <li>• Recibe propuesta y tiempos de entrega.</li>
        </ul>

        <div className="flex flex-wrap gap-3">
          <Link
            href={COTIZACION_URL}
            className="inline-flex items-center rounded-xl px-4 py-3 font-medium ring-1 ring-white/15 hover:bg-white/10"
          >
            Solicitar cotización
          </Link>

          <Link
            href="/#contacto"
            className="rounded-2xl px-5 py-3 font-semibold border border-dashed border-white/20 hover:border-white/40"
          >
            ¿Dudas? Contáctanos
          </Link>
        </div>
      </div>

      <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
        <h3 className="text-xl font-semibold mb-2">Tips para acelerar tu cotización</h3>
        <p className="text-sm text-white/70">
          Incluye dimensiones, fotos de referencia o un enlace a planos. Si es reemplazo, indica el
          modelo actual. Para señalética, añade el texto y color deseado.
        </p>
      </aside>
    </div>
  );
}
