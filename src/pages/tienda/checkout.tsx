"use client";

import Head from "next/head";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const IVA_RATE = 0.19;

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image_url?: string | null;
};

type FormData = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rut: string;
  direccion: string;
  ciudad: string;
  region: string;
  codigoPostal: string;
  notas: string;
};

type PaymentMethod = "flow" | "transferencia" | "webpay";

function formatCLP(n: number) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transferencia");
  const [form, setForm] = useState<FormData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rut: "",
    direccion: "",
    ciudad: "",
    region: "",
    codigoPostal: "",
    notas: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart-v1");
      if (raw) {
        const cartItems = JSON.parse(raw);
        if (cartItems.length === 0) {
          router.push("/tienda/carrito");
        }
        setItems(cartItems);
      } else {
        router.push("/tienda/carrito");
      }
    } catch {
      router.push("/tienda/carrito");
    }
  }, [router]);

  const { subNet, tax, total } = {
    subNet: items.reduce((acc, it) => acc + it.price * it.qty, 0),
    tax: Math.round(items.reduce((acc, it) => acc + it.price * it.qty, 0) * IVA_RATE),
    total: items.reduce((acc, it) => acc + it.price * it.qty, 0) * (1 + IVA_RATE),
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProcesando(true);

    try {
      const response = await fetch("/api/woocommerce/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          billing: form,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar el pedido");
      }

      // Limpiar carrito
      localStorage.removeItem("cart-v1");

      // Si es Flow, redirigir a la pasarela de pago
      if (paymentMethod === "flow" && data.flowUrl) {
        window.location.href = data.flowUrl;
      } else {
        // Si es transferencia, ir a página de confirmación
        router.push(`/tienda/orden-confirmada?orderId=${data.orderId}&method=transferencia`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Error al procesar el pedido");
      setProcesando(false);
    }
  };

  if (items.length === 0) {
    return null; // Se redirigirá automáticamente
  }

  return (
    <>
      <Head>
        <title>Checkout | Tienda</title>
      </Head>

      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold text-black mb-8">Finalizar Compra</h1>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Formulario de datos */}
            <div className="lg:col-span-2 space-y-6">
              {/* Datos personales */}
              <div className="rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-black mb-4">Datos de facturación</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white text-black px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.apellido}
                      onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white text-black px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white text-black px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white text-black px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RUT *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.rut}
                      onChange={(e) => setForm({ ...form, rut: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white text-black px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                      placeholder="12.345.678-9"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.direccion}
                      onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white text-black px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.ciudad}
                      onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white text-black px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Región *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white text-black px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal (opcional)
                    </label>
                    <input
                      type="text"
                      value={form.codigoPostal}
                      onChange={(e) => setForm({ ...form, codigoPostal: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white text-black px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas del pedido (opcional)
                    </label>
                    <textarea
                      rows={4}
                      value={form.notas}
                      onChange={(e) => setForm({ ...form, notas: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white text-black px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none resize-none"
                      placeholder="Notas sobre tu pedido, ej. instrucciones de entrega"
                    />
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-black mb-4">Método de pago</h2>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="flow"
                      checked={paymentMethod === "flow"}
                      onChange={() => setPaymentMethod("flow")}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-black">Flow - Pago en línea</div>
                      <p className="text-sm text-gray-600 mt-1">
                        Paga con tarjeta de crédito, débito o transferencia a través de Flow
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="transferencia"
                      checked={paymentMethod === "transferencia"}
                      onChange={() => setPaymentMethod("transferencia")}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-black">Transferencia Bancaria</div>
                      <p className="text-sm text-gray-600 mt-1">
                        Realiza una transferencia directa a nuestra cuenta bancaria
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-black mb-4">Tu pedido</h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.qty}
                      </span>
                      <span className="font-medium">
                        {formatCLP(item.price * item.qty * 1.19)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal (neto)</span>
                    <span className="font-medium">{formatCLP(subNet)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (19%)</span>
                    <span className="font-medium">{formatCLP(tax)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-base">
                    <span className="font-bold">Total</span>
                    <span className="font-extrabold text-emerald-600">{formatCLP(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={procesando}
                  className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {procesando ? "Procesando..." : "Realizar pedido"}
                </button>

                <p className="text-xs text-gray-500 mt-4">
                  Al realizar el pedido, aceptas nuestros términos y condiciones.
                </p>
              </div>
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </>
  );
}

