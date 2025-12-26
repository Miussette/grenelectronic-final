import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  price_cents: number;      // precio en centavos CLP
  stock: number;
  category?: string | null; // "ADAPTADORES, ENCHUFE, ..."
  image?: string | null;    // /public/... o URL
};

// 👇 Siempre CLP
const formatCLP = (cents: number) => {
  const n = Number.isFinite(cents) ? cents : 0; // evita NaN
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" })
    .format(n / 100);
};

export default function ProductCard({ p }: { p: ProductCardData }) {
  const { add } = useCart();

  const catLine = (p.category ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");

  const handleAdd = () => {
    add({
      id: p.id,
      name: p.name,
      price: p.price_cents,          // guardamos en centavos
      image_url: p.image ?? null,
      sku: p.slug,
    });
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
      <Link href={`/tienda/${p.slug}`} className="block relative aspect-[4/3] bg-neutral-50">
        {p.image && (
          <Image
            src={p.image}
            alt={p.name}
            fill
            className="object-contain"
            sizes="(min-width:1024px) 25vw, 100vw"
          />
        )}
      </Link>

      <div className="p-3 sm:p-4">
        {catLine && (
          <div className="text-[11px] tracking-wide text-neutral-500 uppercase line-clamp-1">
            {catLine}
          </div>
        )}

        <Link href={`/tienda/${p.slug}`} className="block">
          <h3 className="mt-1 font-extrabold text-neutral-900 uppercase leading-snug line-clamp-2">
            {p.name}
          </h3>
        </Link>

        <div className="mt-1 text-xl font-semibold text-neutral-900">
          {formatCLP(p.price_cents)}{" "}
          <span className="text-sm font-normal text-neutral-600">IVA incluido</span>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <Link
            href={`/tienda/cotizacion?producto=${encodeURIComponent(p.name)}`}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-500 transition"
          >
            Solicitar cotización
          </Link>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-neutral-800 hover:bg-neutral-50 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-neutral-700">
              <path d="M6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 10V7a3 3 0 1 1 6 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold text-[13px] uppercase tracking-wide">Añadir al carrito</span>
          </button>
        </div>
      </div>
    </div>
  );
}
