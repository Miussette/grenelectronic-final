import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Quote = Record<string, any> & { id: number; createdAt?: string };

function toCsv(rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return "";
  const keys = Array.from(rows.reduce((s, r) => {
    Object.keys(r).forEach(k => s.add(k));
    return s;
  }, new Set<string>()));

  const esc = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes("\n") || s.includes('"')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const header = keys.join(",");
  const lines = rows.map(r => keys.map(k => esc(r[k])).join(","));
  return [header, ...lines].join("\n");
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then((r) => r.json())
      .then((j) => {
        if (!j.ok) throw new Error(j.error || "No autorizado");
        setQuotes(j.quotes || []);
      })
      .catch((e) => setErr(e.message));
  }, []);

  const filtered = useMemo(() => {
    if (!quotes) return [];
    const q = query.trim().toLowerCase();
    if (!q) return quotes.slice().reverse();
    return quotes
      .filter((it) => {
        try {
          const text = JSON.stringify(it).toLowerCase();
          return text.includes(q);
        } catch {
          return false;
        }
      })
      .slice()
      .reverse();
  }, [quotes, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  function downloadCsv(rows: Quote[]) {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cotizaciones_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function QuoteCard({ q }: { q: Quote }) {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState<any>(() => ({
      nombre: q.nombre ?? "",
      email: q.email ?? "",
      telefono: q.telefono ?? "",
      empresa: q.empresa ?? q.rut ?? "",
      direccion: q.direccion ?? "",
      mensaje: q.mensaje ?? "",
      lineItems: q.lineItems ?? [],
    }));

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[] | null>(null);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const subtotal = (form.lineItems || []).reduce((s: number, it: any) => s + (Number(it.price || 0) * Number(it.qty || 1)), 0);

    async function runSearch() {
      if (!searchTerm) return setSearchResults(null);
      setLoadingSearch(true);
      try {
        const r = await fetch(`/api/admin/products?q=${encodeURIComponent(searchTerm)}`);
        const j = await r.json();
        if (!j.ok) throw new Error(j.error || 'Error');
        setSearchResults(j.products || []);
      } catch (e) {
        console.error(e);
        setSearchResults([]);
      } finally { setLoadingSearch(false); }
    }

    function addProduct(p: any) {
      const next = [...(form.lineItems || [])];
      const price = (p.price !== undefined && p.price !== null) ? Number(p.price) : 0;
      next.push({ id: `p-${Date.now()}`, name: p.name, price, qty: 1, sourceId: p.id });
      setForm({ ...form, lineItems: next });
    }

    function formatCurrency(v: number) {
      try {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);
      } catch {
        return String(v);
      }
    }

    function removeItem(idx: number) {
      const next = [...(form.lineItems || [])];
      next.splice(idx, 1);
      setForm({ ...form, lineItems: next });
    }

    async function save() {
      try {
        const resp = await fetch(`/api/admin/quotes/${q.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, updatedAt: new Date().toISOString() }),
        });
        const j = await resp.json();
        if (!j.ok) throw new Error(j.error || 'Error saving');
        // Reload to reflect changes simply
        location.reload();
      } catch (e) {
        console.error(e);
        alert('Error al guardar');
      }
    }

    async function generatePdf() {
      try {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        const title = `Cotizacion-${q.id}`;
        doc.setFontSize(16);
        doc.text(title, 14, 20);
        doc.setFontSize(11);
        const lines = [] as string[];
        lines.push(`ID: ${q.id}`);
        lines.push(`Fecha: ${q.createdAt ?? '-'} `);
        lines.push(`Nombre: ${form.nombre ?? q.nombre ?? '-'} `);
        lines.push(`Email: ${form.email ?? q.email ?? '-'} `);
        lines.push(`Teléfono: ${form.telefono ?? q.telefono ?? '-'} `);
        lines.push(`Empresa / RUT: ${form.empresa ?? q.empresa ?? q.rut ?? '-'} `);
        lines.push(`Dirección: ${form.direccion ?? q.direccion ?? '-'} `);
        lines.push('');
        lines.push('Productos:');
        const items = form.lineItems || [];
        items.forEach((it: any, i: number) => {
          lines.push(`${i+1}. ${it.name} — ${it.qty} x ${it.price}`);
        });
        lines.push('');
        lines.push(`Subtotal: ${subtotal}`);
        lines.push('');
        lines.push('Mensaje:');
        const msg = form.mensaje ?? q.mensaje ?? '-';
        const msgLines = doc.splitTextToSize(String(msg), 180);
        const all = lines.concat(msgLines);
        doc.setFontSize(10);
        doc.text(all, 14, 30);
        doc.save(`${title}.pdf`);
      } catch (e) {
        console.error('Error generando PDF', e);
        alert('Error al generar PDF');
      }
    }

    return (
      <div className="p-4 border rounded">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 cursor-pointer" onClick={() => setOpen(v => !v)}>{q.createdAt ?? "-"} — {q.email ?? q.telefono ?? "-"}</div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600 mr-2">ID: {q.id}</div>
            <button className="px-2 py-1 border rounded text-sm" onClick={() => setEdit(e => !e)}>{edit ? 'Cancelar edición' : 'Editar'}</button>
          </div>
        </div>

        {!open && (
          <div className="mt-2 text-sm text-gray-700">{(q.mensaje && String(q.mensaje).slice(0, 150)) ?? "(sin mensaje)"}</div>
        )}

        {open && (
          <div className="mt-3 text-sm text-gray-800 space-y-2">
            {!edit && (
              <>
                <div><strong>Nombre:</strong> {q.nombre ?? "-"}</div>
                <div><strong>Email:</strong> {q.email ?? "-"}</div>
                <div><strong>Teléfono:</strong> {q.telefono ?? "-"}</div>
                <div><strong>Empresa / RUT:</strong> {q.empresa ?? q.rut ?? "-"}</div>
                <div><strong>Dirección:</strong> {q.direccion ?? "-"}</div>
                <div><strong>Mensaje:</strong>
                  <div className="mt-1 p-2 bg-gray-50 border rounded text-xs whitespace-pre-wrap">{q.mensaje ?? "-"}</div>
                </div>
                {q.lineItems && q.lineItems.length > 0 && (
                  <div>
                    <strong>Productos:</strong>
                    <ul className="list-disc ml-5 mt-1 text-sm">
                      {q.lineItems.map((it: any, i: number) => (
                        <li key={i}>{it.name} — {it.qty} x {formatCurrency(Number(it.price || 0))} <span className="text-gray-500 text-xs">(ID tienda: {it.sourceId ?? '-'})</span></li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => downloadCsv([q])} className="px-3 py-1 bg-sky-600 text-white rounded text-sm">Descargar CSV (solo esta)</button>
                  <button onClick={generatePdf} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Descargar PDF</button>
                </div>
              </>
            )}

            {edit && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input className="p-2 border rounded" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Nombre" />
                  <input className="p-2 border rounded" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" />
                  <input className="p-2 border rounded" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} placeholder="Teléfono" />
                  <input className="p-2 border rounded" value={form.empresa} onChange={e => setForm({...form, empresa: e.target.value})} placeholder="Empresa / RUT" />
                  <input className="p-2 border rounded col-span-2" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} placeholder="Dirección" />
                </div>
                <div>
                  <textarea className="w-full p-2 border rounded" value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} placeholder="Mensaje" />
                </div>

                <div className="border-t pt-2">
                  <div className="flex items-center gap-2">
                    <input className="p-2 border rounded w-64" placeholder="Buscar producto en tienda" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
                    <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={runSearch} disabled={loadingSearch}>{loadingSearch ? 'Buscando...' : 'Buscar'}</button>
                  </div>
                  {searchResults && (
                    <div className="mt-2 border p-2 max-h-48 overflow-y-auto">
                      {searchResults.length === 0 && <div className="text-sm text-gray-500">No se encontraron</div>}
                      {searchResults.map((p, i) => (
                        <div key={p.id} className="flex items-center justify-between py-1">
                          <div className="text-sm">{p.name} — {p.price ?? 'sin precio'}</div>
                          <button className="px-2 py-1 border rounded text-sm" onClick={()=>addProduct(p)}>Añadir</button>
                        </div>
                      ))}
                    </div>
                  )}

                    <div className="mt-3">
                    <strong>Productos en cotización</strong>
                    <div className="mt-2 space-y-2">
                      {(form.lineItems || []).map((it: any, idx: number) => (
                        <div key={it.id} className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{it.name}</div>
                            <div className="text-xs text-gray-500">{it.sourceId ? `ID tienda: ${it.sourceId}` : ''}</div>
                          </div>
                          <input value={it.qty} onChange={e=>{
                            const next = [...(form.lineItems||[])]; next[idx].qty = Number(e.target.value||1); setForm({...form, lineItems: next});
                          }} className="w-16 p-1 border rounded text-center" />
                          <input value={String(it.price ?? '')} onChange={e=>{
                            const next = [...(form.lineItems||[])]; next[idx].price = Number(e.target.value||0); setForm({...form, lineItems: next});
                          }} className="w-24 p-1 border rounded text-right" />
                          <button className="px-2 py-1 border rounded" onClick={()=>removeItem(idx)}>Eliminar</button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-sm">Subtotal: <strong>{formatCurrency(subtotal)}</strong></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={save}>Guardar</button>
                  <button className="px-3 py-1 border rounded" onClick={()=>{ setEdit(false); setForm({ nombre: q.nombre ?? "", email: q.email ?? "", telefono: q.telefono ?? "", empresa: q.empresa ?? q.rut ?? "", direccion: q.direccion ?? "", mensaje: q.mensaje ?? "", lineItems: q.lineItems ?? [] }); }}>Cancelar</button>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={generatePdf}>Descargar PDF</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin - Cotizaciones</title>
      </Head>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Cotizaciones</h1>
            <div className="flex items-center gap-3">
              <input
                placeholder="Buscar... (email, nombre, producto, detalles)"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                className="p-2 border rounded w-64 bg-white text-black"
              />
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="p-2 border rounded">
                <option value={10}>10 / pág</option>
                <option value={25}>25 / pág</option>
                <option value={50}>50 / pág</option>
                <option value={100}>100 / pág</option>
              </select>
              <button className="px-3 py-2 bg-emerald-600 text-white rounded" onClick={() => downloadCsv(filtered)}>
                Descargar CSV (filtrado)
              </button>
            </div>
          </div>

          {err && <div className="text-red-600">{err}</div>}
          {!quotes && !err && <div>Cargando...</div>}

          {quotes && (
            <>
              <div className="mb-4 text-sm text-gray-600">Mostrando {filtered.length} resultado(s).</div>
              <div className="space-y-4">
                {pageItems.map((q) => (
                  <QuoteCard key={q.id} q={q} />
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm">Página {page} de {totalPages}</div>
                <div className="flex items-center gap-2">
                  <button disabled={page<=1} onClick={()=>setPage(1)} className="px-2 py-1 border rounded disabled:opacity-50">Primera</button>
                  <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-2 py-1 border rounded disabled:opacity-50">Anterior</button>
                  <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-2 py-1 border rounded disabled:opacity-50">Siguiente</button>
                  <button disabled={page>=totalPages} onClick={()=>setPage(totalPages)} className="px-2 py-1 border rounded disabled:opacity-50">Última</button>
                </div>
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
