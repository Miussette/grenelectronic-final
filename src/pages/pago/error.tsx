// src/pages/pago/error.tsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PagoError() {
  const { query } = useRouter();
  const orderId = typeof query.orderId === "string" ? query.orderId : "";
  const code = typeof query.code === "string" ? query.code : "";
  const reason = typeof query.reason === "string" ? query.reason : "";

  return (
    <>
      <Head><title>Pago no completado</title></Head>
      <main className="min-h-screen bg-neutral-50">
        <div className="container mx-auto max-w-xl px-4 py-16">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold text-red-700">No se pudo completar el pago</h1>
            <p className="mt-2 text-neutral-700">
              {orderId && <>Orden: <span className="font-medium">{orderId}</span>. </>}
              {code && <>Código de estado: <span className="font-mono">{code}</span>. </>}
              {reason && <>Motivo: <span className="font-mono">{reason}</span>. </>}
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/checkout" className="underline">Intentar nuevamente</Link>
              <Link href="/tienda" className="underline">Volver a la tienda</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
