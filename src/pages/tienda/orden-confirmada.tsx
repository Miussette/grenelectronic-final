import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrdenConfirmadaPage() {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <>
      <Head>
        <title>Pedido Confirmado | Tienda</title>
      </Head>

      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-16">
          <div className="text-center">
            <div className="mb-6 text-6xl">✓</div>
            <h1 className="text-4xl font-bold text-emerald-600 mb-4">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-xl text-gray-700 mb-2">
              Tu pedido ha sido recibido correctamente
            </p>
            {orderId && (
              <p className="text-lg text-gray-600 mb-8">
                Número de orden: <strong>#{orderId}</strong>
              </p>
            )}

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 mb-8">
              <h2 className="text-xl font-bold text-emerald-900 mb-4">
                ¿Qué sigue?
              </h2>
              <div className="text-left max-w-2xl mx-auto space-y-3 text-emerald-800">
                <p>✓ Recibirás un email de confirmación con los detalles de tu pedido</p>
                <p>✓ Nuestro equipo revisará tu orden y te contactará para coordinar el pago y entrega</p>
                <p>✓ Una vez confirmado el pago, procesaremos tu pedido</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href="/tienda"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                Volver a la tienda
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
