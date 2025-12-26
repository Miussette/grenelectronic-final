"use client";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, Minus, Plus } from "lucide-react";

const IVA_RATE = 0.19; // IVA Chile 19%

type CartItem = {
  id: string; // product id
  name: string;
  priceNet: number; // VALOR NETO por unidad
  quantity: number;
  image_url?: string | null;
  sku?: string | null;
};

// Formato que viene guardado desde CartContext (cart-v1)
type StoredCartItem = {
  id: string;
  name: string;
  price: number; // price -> priceNet
  qty: number; // qty -> quantity
  image_url?: string | null;
  sku?: string | null;
};

function formatCLP(n: number) {
  return n.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar del storage usando el mismo key que CartContext
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart-v1");
      if (!raw) return;

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const cartItems = parsed as StoredCartItem[];

      // Convertir de CartContext format a CartPage format (sin any)
      const converted: CartItem[] = cartItems.map((item) => ({
        id: String(item.id),
        name: String(item.name),
        priceNet: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.qty) || 1),
        image_url: item.image_url ?? null,
        sku: item.sku ?? null,
      }));

      setItems(converted);
    } catch {
      // si falla, dejamos el carrito vacío
    }
  }, []);

  // Guardar en storage
  useEffect(() => {
    // Convertir de CartPage format a CartContext format
    const converted: StoredCartItem[] = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.priceNet,
      qty: item.quantity,
      image_url: item.image_url ?? null,
      sku: item.sku ?? null,
    }));

    localStorage.setItem("cart-v1", JSON.stringify(converted));
  }, [items]);

  // Totales
  const { subNet, tax, total } = useMemo(() => {
    const sub = items.reduce((acc, it) => acc + it.priceNet * it.quantity, 0);
    const iva = Math.round(sub * IVA_RATE);
    const tot = sub + iva;
    return { subNet: sub, tax: iva, total: tot };
  }, [items]);

  const inc = (id: string) =>
    setItems((arr) =>
      arr.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );

  const dec = (id: string) =>
    setItems((arr) =>
      arr.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );

  const removeItem = (id: string) => setItems((arr) => arr.filter((i) => i.id !== id));

  const clearCart = () => setItems([]);

  const handleCheckout = () => {
    window.location.href = "/tienda/checkout";
  };

  return (
    <>
      <Head>
        <title>Carrito | Tienda</title>
        <meta name="description" content="Tu carrito de compras" />
      </Head>

      <Navbar />

      <main className="bg-white text-neutral-900">
        {/* Encabezado */}
        <section className="py-10 border-b border-neutral-200">
          <div className="container mx-auto max-w-6xl px-4">
            <span className="inline-block h-1.5 w-14 rounded bg-emerald-600 mb-5" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Carrito de compras
            </h1>
            <p className="mt-2 text-neutral-600">Revisa tus productos.</p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto max-w-6xl px-4 grid lg:grid-cols-3 gap-6">
            {/* Lista de items */}
            <div className="lg:col-span-2">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-neutral-200 p-8 text-center">
                  <p className="text-neutral-700">Tu carrito está vacío.</p>
                  <Link
                    href="/tienda"
                    className="mt-4 inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    Ir a la tienda
                  </Link>
                </div>
              ) : (
                <div className="rounded-2xl border border-neutral-200 divide-y">
                  {items.map((it) => {
                    const lineNet = it.priceNet * it.quantity;
                    const lineTax = Math.round(lineNet * IVA_RATE);
                    const lineTotal = lineNet + lineTax;

                    return (
                      <div key={it.id} className="p-4 flex items-center gap-4">
                        <div className="h-16 w-16 relative rounded-lg overflow-hidden bg-neutral-100">
                          {it.image_url ? (
                            <Image
                              src={it.image_url}
                              alt={it.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : null}
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold">{it.name}</div>
                          <div className="text-xs text-neutral-500">
                            {it.sku ? `SKU: ${it.sku}` : null}
                          </div>

                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div>
                              <div className="text-neutral-500">Precio neto</div>
                              <div className="font-medium">{formatCLP(it.priceNet)}</div>
                            </div>
                            <div>
                              <div className="text-neutral-500">IVA (19%)</div>
                              <div className="font-medium">{formatCLP(lineTax)}</div>
                            </div>
                            <div>
                              <div className="text-neutral-500">Total</div>
                              <div className="font-bold">{formatCLP(lineTotal)}</div>
                            </div>

                            <div className="flex items-center gap-2 justify-start md:justify-end">
                              <button
                                onClick={() => dec(it.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 hover:bg-neutral-50"
                                aria-label="Disminuir"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <input
                                value={it.quantity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const q = Math.max(1, Number(e.target.value || 1));
                                  setItems((arr) =>
                                    arr.map((x) => (x.id === it.id ? { ...x, quantity: q } : x))
                                  );
                                }}
                                type="number"
                                min={1}
                                className="w-14 text-center rounded-lg border border-neutral-300 py-1"
                              />

                              <button
                                onClick={() => inc(it.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 hover:bg-neutral-50"
                                aria-label="Aumentar"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(it.id)}
                          className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                          aria-label="Eliminar"
                          title="Eliminar"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {items.length > 0 && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Vaciar carrito
                  </button>

                  <Link
                    href="/tienda"
                    className="text-sm text-emerald-700 hover:text-emerald-800 underline"
                  >
                    Seguir comprando
                  </Link>
                </div>
              )}
            </div>

            {/* Resumen */}
            <aside className="rounded-2xl border border-neutral-200 p-5 h-fit">
              <h2 className="text-lg font-bold">Resumen</h2>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal (neto)</span>
                  <span className="font-medium">{formatCLP(subNet)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-600">IVA (19%)</span>
                  <span className="font-medium">{formatCLP(tax)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-extrabold">{formatCLP(total)}</span>
                </div>
              </div>

              <button
                disabled={items.length === 0}
                className="mt-5 w-full inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCheckout}
              >
                Continuar con el pedido
              </button>

              <p className="text-xs text-neutral-500 mt-3">
                Los valores publicados son referenciales. El total definitivo podría variar por
                despacho/instalación y será confirmado en la cotización formal.
              </p>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
