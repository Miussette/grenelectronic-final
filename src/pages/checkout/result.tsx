// pages/checkout/result.tsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function CheckoutResult() {
  const { query } = useRouter();
  const status = (query.status as string) || "failed";
  const order = query.order as string | undefined;

  return (
    <main className="container">
      <h1>{status === "paid" ? "¡Pago exitoso!" : "Pago no realizado"}</h1>
      {order && <p>Orden: {order}</p>}

      <Link href="/tienda" className="inline-block mt-4 text-emerald-700 hover:underline">
        Volver a la tienda
      </Link>
    </main>
  );
}
