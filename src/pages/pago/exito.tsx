import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PagoExito() {
  const { query } = useRouter();
  const orderId = typeof query.orderId === "string" ? query.orderId : "";

  return (
    <>
      <Head><title>Pago exitoso</title></Head>
      <main className="min-h-screen bg-neutral-50">
        <div className="container mx-auto max-w-xl px-4 py-16">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold text-emerald-700">¡Pago realizado!</h1>
            <p className="mt-2 text-neutral-700">
              Gracias por tu compra. N° de orden <span className="font-medium">{orderId}</span>.
            </p>
            <div className="mt-6">
              <Link href="/tienda" className="underline">Volver a la tienda</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}