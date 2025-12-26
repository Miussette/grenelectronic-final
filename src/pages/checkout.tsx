// pages/checkout.tsx
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";

/* =========================================================
   Tipos
========================================================= */
type CartItem = {
  id: string | number;
  name: string;
  price: number; // CLP
  qty: number;
  image?: string;
};

type PaymentMethod = "flow" | "transferencia";

/** Respuesta esperada de /api/flow/create-order */
type PaymentInitResponse = {
  paymentUrl: string;
};

/* =========================================================
   Utils
========================================================= */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

/** Convierte unknown a mensaje seguro para mostrar */
function toErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (isRecord(e) && typeof e.message === "string") return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return "Ocurrió un error inesperado.";
  }
}

/** Formatea CLP sin decimales */
function formatCLP(n: number) {
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return String(n);
  }
}

/* =========================================================
   Carrito desde localStorage (fallback si no hay Context)
========================================================= */
function useCartFromLocalStorage(key = "cart") {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        const safe = parsed
          .map((x: unknown): CartItem | null => {
            if (!isRecord(x)) return null;
            const id = (x.id as string | number | undefined) ?? String(Math.random());
            const name = typeof x.name === "string" ? x.name : "Producto";
            const price = Number((x as Record<string, unknown>).price ?? 0);
            const qty = Number((x as Record<string, unknown>).qty ?? 1);
            const image = typeof x.image === "string" ? x.image : undefined;
            if (!Number.isFinite(price) || !Number.isFinite(qty)) return null;
            return { id, name, price, qty, image };
          })
          .filter((x): x is CartItem => x !== null);

        setItems(safe);
      }
    } catch {
      // si hay error, dejamos vacío
    }
  }, [key]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);
    const shipping = 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [items]);

  return { items, totals };
}

/* =========================================================
   Datos bancarios (placeholder)
========================================================= */
const BANK_DATA = {
  banco: "Banco Estado",
  tipoCuenta: "Cuenta Vista",
  numeroCuenta: "12345678",
  titular: "Grene Electronic SpA",
  rut: "76.123.456-7",
  correo: "pagos@grenelectronic.cl",
} as const;

/* =========================================================
   Página
========================================================= */
export default function CheckoutPage() {
  const { items, totals } = useCartFromLocalStorage();
  const [payment, setPayment] = useState<PaymentMethod>("flow");
  const [email, setEmail] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [transferOK, setTransferOK] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const orderId = useMemo(() => {
    const ts = Date.now().toString().slice(-6);
    return `GE-${ts}`;
  }, []);

  const canSubmit = useMemo(
    () => email.trim().length > 3 && nombre.trim().length > 1 && items.length > 0,
    [email, nombre, items.length]
  );

  const handlePayWithFlow = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const resp = await fetch("/api/flow/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: totals.total,
          email,
          nombre,
          telefono,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty,
          })),
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "No se pudo crear la orden en Flow.");
      }

      const data: unknown = await resp.json();
      if (!isRecord(data) || typeof data.paymentUrl !== "string" || data.paymentUrl.length === 0) {
        throw new Error("Respuesta inválida del servidor (falta paymentUrl).");
      }

      window.location.href = data.paymentUrl;
    } catch (e: unknown) {
      setErrorMsg(toErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmTransfer = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      // Placeholder: cuando tengamos backend, haremos un fetch a /api/orders/create-pending-transfer
      setTransferOK(true);
      // Opcional: limpiar carrito
      // localStorage.removeItem("cart");
    } catch (e: unknown) {
      setErrorMsg(toErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Checkout | Grenelectronic</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-semibold">Checkout</h1>
            <Link href="/tienda" className="text-sm underline hover:opacity-80">
              Seguir comprando
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda */}
            <section className="lg:col-span-2 space-y-6">
              {/* Datos de contacto */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-lg font-medium mb-4">Datos de contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Nombre y apellido</label>
                    <input
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ej: Carola Carrasco"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Teléfono</label>
                    <input
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm">Email (recibirás el comprobante)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="nombre@correo.cl"
                    />
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-lg font-medium mb-4">Método de pago</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Flow */}
                  <button
                    type="button"
                    onClick={() => setPayment("flow")}
                    className={`text-left rounded-2xl border p-4 transition shadow-sm hover:shadow ${
                      payment === "flow" ? "ring-2 ring-emerald-500 border-emerald-500" : "border-neutral-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">Flow (Webpay, tarjetas, etc.)</p>
                        <p className="text-sm text-neutral-500 mt-1">
                          Pago en plataforma segura de Flow. Confirmación automática.
                        </p>
                      </div>
                      <span
                        className={`mt-1 inline-block h-4 w-4 rounded-full border ${
                          payment === "flow" ? "bg-emerald-500 border-emerald-500" : "border-neutral-300"
                        }`}
                      />
                    </div>
                  </button>

                  {/* Transferencia */}
                  <button
                    type="button"
                    onClick={() => setPayment("transferencia")}
                    className={`text-left rounded-2xl border p-4 transition shadow-sm hover:shadow ${
                      payment === "transferencia" ? "ring-2 ring-emerald-500 border-emerald-500" : "border-neutral-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">Transferencia bancaria</p>
                        <p className="text-sm text-neutral-500 mt-1">
                          Te mostramos los datos bancarios y confirmas tu pedido.
                        </p>
                      </div>
                      <span
                        className={`mt-1 inline-block h-4 w-4 rounded-full border ${
                          payment === "transferencia" ? "bg-emerald-500 border-emerald-500" : "border-neutral-300"
                        }`}
                      />
                    </div>
                  </button>
                </div>

                {/* Datos bancarios */}
                {payment === "transferencia" && (
                  <div className="mt-5 rounded-2xl border bg-neutral-50 p-4">
                    <h3 className="font-medium mb-3">Datos para transferir</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                      <p><span className="text-neutral-500">Banco:</span> {BANK_DATA.banco}</p>
                      <p><span className="text-neutral-500">Tipo de cuenta:</span> {BANK_DATA.tipoCuenta}</p>
                      <p><span className="text-neutral-500">N° de cuenta:</span> {BANK_DATA.numeroCuenta}</p>
                      <p><span className="text-neutral-500">Titular:</span> {BANK_DATA.titular}</p>
                      <p><span className="text-neutral-500">RUT:</span> {BANK_DATA.rut}</p>
                      <p><span className="text-neutral-500">Correo de comprobante:</span> {BANK_DATA.correo}</p>
                    </div>
                    <p className="mt-3 text-sm text-neutral-600">
                      Importante: envía el comprobante indicando el número de orden <span className="font-semibold">{orderId}</span>.
                    </p>
                  </div>
                )}

                {/* Acciones */}
                {errorMsg && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMsg}
                  </div>
                )}

                {!transferOK ? (
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {payment === "flow" ? (
                      <button
                        disabled={!canSubmit || isSubmitting}
                        onClick={handlePayWithFlow}
                        className="rounded-2xl px-5 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isSubmitting ? "Redirigiendo a Flow..." : "Pagar con Flow"}
                      </button>
                    ) : (
                      <button
                        disabled={!canSubmit || isSubmitting}
                        onClick={handleConfirmTransfer}
                        className="rounded-2xl px-5 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isSubmitting ? "Registrando pedido..." : "Confirmar pedido por transferencia"}
                      </button>
                    )}

                    <p className="text-xs text-neutral-500">
                      Al continuar aceptas los términos y condiciones de Grenelectronic.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border bg-emerald-50 p-4">
                    <p className="text-emerald-800 font-medium">
                      ¡Listo! Tu pedido <span className="font-semibold">{orderId}</span> quedó como <em>pendiente por transferencia</em>.
                    </p>
                    <p className="text-sm text-emerald-800 mt-1">
                      Realiza la transferencia y envía el comprobante a{" "}
                      <a className="underline" href={`mailto:${BANK_DATA.correo}`}>{BANK_DATA.correo}</a>.
                    </p>
                    <div className="mt-3">
                      <Link href="/tienda" className="text-sm underline">
                        Volver a la tienda
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Columna derecha: resumen */}
            <aside className="bg-white rounded-2xl shadow-sm border p-6 h-fit">
              <h2 className="text-lg font-medium mb-4">Resumen de compra</h2>

              <ul className="space-y-4">
                {items.length === 0 && (
                  <li className="text-sm text-neutral-500">Tu carrito está vacío.</li>
                )}
                {items.map((it) => (
                  <li key={String(it.id)} className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-xl bg-neutral-100 overflow-hidden">
                      {it.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{it.name}</p>
                      <p className="text-xs text-neutral-500">Cant. {it.qty}</p>
                    </div>
                    <div className="text-sm font-medium tabular-nums">
                      ${formatCLP(it.price * it.qty)}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="my-5 h-px bg-neutral-200" />

              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value={`$${formatCLP(totals.subtotal)}`} />
                <Row label="Envío" value={`$${formatCLP(totals.shipping)}`} />
                <div className="pt-2 flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">${formatCLP(totals.total)}</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-neutral-500">
                N° de orden provisional: <span className="font-semibold">{orderId}</span>
              </p>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

/* =========================================================
   Subcomponentes
========================================================= */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-500">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
