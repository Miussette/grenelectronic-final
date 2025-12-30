import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Quote = any;

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then((r) => r.json())
      .then((j) => {
        if (!j.ok) throw new Error(j.error || "No autorizado");
        setQuotes(j.quotes);
      })
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <>
      <Head>
        <title>Admin - Cotizaciones</title>
      </Head>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Cotizaciones</h1>
          {err && <div className="text-red-600">{err}</div>}
          {!quotes && !err && <div>Cargando...</div>}
          {quotes && (
            <div className="space-y-4">
              {quotes.map((q: Quote) => (
                <div key={q.id} className="p-4 border rounded">
                  <div className="text-sm text-gray-500">{q.createdAt} — {q.email}</div>
                  <pre className="mt-2 text-sm">{JSON.stringify(q, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
