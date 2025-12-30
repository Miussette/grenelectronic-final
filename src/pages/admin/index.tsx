import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminProfile() {
  const [me, setMe] = useState<{ name: string } | null>(null);
  const [quotesCount, setQuotesCount] = useState<number | null>(null);
  const [recent, setRecent] = useState<any[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((j) => {
        if (!j.ok) throw new Error(j.error || "No autorizado");
        setMe(j.user || null);
      })
      .catch((e) => setErr(e.message));

    fetch("/api/admin/quotes")
      .then((r) => r.json())
      .then((j) => {
        if (!j.ok) throw new Error(j.error || "No autorizado");
        const q = j.quotes || [];
        setQuotesCount(q.length);
        setRecent(q.slice(-10).reverse());
      })
      .catch((e) => setErr((s) => s ? s + "; " + e.message : e.message));
  }, []);

  return (
    <>
      <Head>
        <title>Admin - Perfil</title>
      </Head>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Perfil de Superadmin</h1>
          {err && <div className="text-red-600">{err}</div>}
          {!me && !err && <div>Cargando perfil...</div>}
          {me && (
            <div className="space-y-4">
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-600">Usuario: <strong>{me.name}</strong></div>
                <div className="text-sm text-gray-600">Cotizaciones guardadas: <strong>{quotesCount ?? "-"}</strong></div>
                <div className="mt-3 flex gap-2">
                  <Link href="/admin/cotizaciones" className="px-3 py-2 bg-emerald-600 text-white rounded">Ver todas las cotizaciones</Link>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Últimas cotizaciones</h2>
                {!recent && <div>Cargando...</div>}
                {recent && recent.length === 0 && <div className="text-sm text-gray-600">No hay cotizaciones aún.</div>}
                {recent && recent.map((q) => (
                  <div key={q.id} className="p-3 border rounded mb-2">
                    <div className="text-xs text-gray-500">{q.createdAt ?? "-"} — ID: {q.id}</div>
                    <pre className="text-sm mt-1 overflow-x-auto">{JSON.stringify(q, null, 2)}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
