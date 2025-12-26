"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";

type CardProps = {
  slug: string;
  name: string;
  price?: string | null;
  image?: { sourceUrl?: string; altText?: string | null };
  categories?: Array<{ slug: string; name: string }>;
};

export function ProductCard({ slug, name, price, image, categories = [] }: CardProps) {
  const { add } = useCart();
  const router = useRouter();

  // Verificar si está en la categoría "desarrollo"
  const isDesarrollo = categories.some(cat => cat.slug === "desarrollo");

  // Parsear precio CLP venido de Woo (puede traer separadores . o ,)
  const parseCLP = (raw?: string | null) => {
    if (!raw) return 0;
    const digits = raw.replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  };

  const priceGross = parseCLP(price); // asumimos viene con IVA desde WooCommerce
  const priceNet = priceGross > 0 ? Math.round(priceGross / 1.19) : 0; // para carrito (neto)

  const formatCLP = (value: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(value);
  // Si es de desarrollo, no mostrar precio aunque lo tenga
  const hasPrice = !isDesarrollo && priceGross > 0;

  const handleAddToCart = () => {
    if (!priceGross) return;

    console.log("Agregando al carrito:", {
      id: slug,
      name,
      price: priceNet,
      image_url: image?.sourceUrl || null,
    });

    add({
      id: slug,
      name,
      price: priceNet, // guardamos neto; el checkout agrega IVA
      image_url: image?.sourceUrl || null,
      sku: slug,
    });

    // Redirigir al carrito
    router.push("/tienda/carrito");
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      {/* Imagen con altura fija */}
      <div className="h-48 bg-gray-100 flex-shrink-0">
        {image?.sourceUrl ? (
          <img
            src={image.sourceUrl}
            alt={image.altText ?? name}
            className="h-full w-full object-contain p-2"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            Sin imagen
          </div>
        )}
      </div>

      {/* Contenido con altura flexible */}
      <div className="p-4 flex flex-col flex-1">
        {/* Título con altura fija de 2 líneas */}
        <h3 className="text-sm font-semibold text-black mb-3 line-clamp-2 h-10 leading-5">
          {name}
        </h3>

        {/* Precio con altura fija */}
        <div className="h-16 mb-3 flex flex-col justify-center">
          {hasPrice ? (
            <>
              <p className="text-xl font-bold text-emerald-600">
                {formatCLP(priceGross)}
              </p>
              <p className="text-xs text-gray-500">IVA incluido</p>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">Precio bajo cotización</p>
          )}
        </div>

        {/* Botones siempre al fondo */}
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={`/tienda/${slug}`}
            className="w-full text-center rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Ver más
          </Link>

          {hasPrice ? (
            <button
              onClick={handleAddToCart}
              className="w-full rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Agregar al carrito
            </button>
          ) : (
            <Link
              href="/tienda/cotizacion"
              className="w-full text-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Solicitar cotización
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
