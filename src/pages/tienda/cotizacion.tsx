import Head from "next/head";
import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { jsPDF } from "jspdf";

export default function CotizacionPage() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    rut: "",
    direccion: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folio, setFolio] = useState<string>("");
  const [datosGuardados, setDatosGuardados] = useState<typeof form | null>(null);

  const generarPDF = () => {
    if (!datosGuardados) return;

    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString("es-CL");

    // Encabezado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("SOLICITUD DE COTIZACIÓN", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Folio: ${folio}`, 14, 35);
    doc.text(`Fecha: ${fecha}`, 150, 35);

    // Línea separadora
    doc.setDrawColor(200);
    doc.line(14, 40, 196, 40);

    // Datos del solicitante
    let y = 50;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DATOS DEL SOLICITANTE", 14, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nombre: ${datosGuardados.nombre}`, 20, y); y += 6;
    doc.text(`Email: ${datosGuardados.email}`, 20, y); y += 6;
    doc.text(`Teléfono: ${datosGuardados.telefono}`, 20, y); y += 6;
    doc.text(`Empresa: ${datosGuardados.empresa}`, 20, y); y += 6;
    doc.text(`RUT: ${datosGuardados.rut}`, 20, y); y += 6;
    doc.text(`Dirección: ${datosGuardados.direccion}`, 20, y); y += 10;

    // Detalles del proyecto
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DETALLES DEL PROYECTO", 14, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const mensajeLines = doc.splitTextToSize(datosGuardados.mensaje, 175);
    doc.text(mensajeLines, 20, y);
    y += mensajeLines.length * 6 + 10;

    // Pie de página
    y = Math.max(y, 260);
    doc.setDrawColor(200);
    doc.line(14, y, 196, y);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Grenelectronic Chile - Cotización referencial sujeta a confirmación", 105, y + 6, { align: "center" });
    doc.text("www.grenelectronic.cl", 105, y + 11, { align: "center" });

    // Descargar
    doc.save(`cotizacion_${folio}_${fecha.replace(/\//g, "-")}.pdf`);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      // Aquí puedes enviar a tu API o servicio de email
      const response = await fetch("/api/products/cotizaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Error al enviar cotización");

      // Guardar datos antes de limpiar el formulario
      setDatosGuardados({ ...form });

      // Generar folio único
      const folioGenerado = `COT-${Date.now().toString().slice(-8)}`;
      setFolio(folioGenerado);
      setEnviado(true);
      
      // Limpiar formulario
      setForm({
        nombre: "",
        email: "",
        telefono: "",
        empresa: "",
        rut: "",
        direccion: "",
        mensaje: "",
      });
    } catch (err) {
      setError("Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Head>
        <title>Solicitar Cotización | Tienda</title>
        <meta name="description" content="Solicita una cotización personalizada" />
      </Head>

      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-8">
            <span className="inline-block h-1.5 w-14 rounded bg-emerald-600 mb-4" />
            <h1 className="text-4xl font-bold text-black">Solicitar Cotización</h1>
            <p className="mt-3 text-gray-600">
              Completa el formulario y nos pondremos en contacto contigo con una cotización personalizada.
            </p>
          </div>

          {enviado ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <div className="mb-4 text-5xl">✓</div>
              <h2 className="text-2xl font-bold text-emerald-900 mb-2">
                ¡Solicitud enviada con éxito!
              </h2>
              <p className="text-emerald-800 mb-4">
                Hemos recibido tu solicitud de cotización con el folio: <strong>{folio}</strong>
              </p>
              <p className="text-emerald-700 mb-6">
                Nos pondremos en contacto contigo pronto.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={generarPDF}
                  className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                  📄 Descargar PDF
                </button>
                <button
                  onClick={() => {
                    setEnviado(false);
                    setFolio("");
                    setDatosGuardados(null);
                  }}
                  className="inline-flex items-center rounded-xl border border-emerald-600 bg-white px-6 py-3 font-semibold text-emerald-600 hover:bg-emerald-50"
                >
                  Enviar otra cotización
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    required
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div>
                  <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa *
                  </label>
                  <input
                    id="empresa"
                    type="text"
                    required
                    value={form.empresa}
                    onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    placeholder="Mi Empresa S.A."
                  />
                </div>

                <div>
                  <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-2">
                    RUT *
                  </label>
                  <input
                    id="rut"
                    type="text"
                    required
                    value={form.rut}
                    onChange={(e) => setForm({ ...form, rut: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    placeholder="12.345.678-9"
                    pattern="^[0-9.\-]+$"
                    title="Formato: 12.345.678-9"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    id="direccion"
                    type="text"
                    required
                    value={form.direccion}
                    onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    placeholder="Calle 123, Comuna, Ciudad"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje / Detalles del proyecto *
                </label>
                <textarea
                  id="mensaje"
                  required
                  rows={6}
                  value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none resize-none"
                  placeholder="Describe tu proyecto, cantidades necesarias, plazos, etc."
                />
              </div>

              {error && (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 text-red-800">
                  {error}
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  disabled={enviando}
                  className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enviando ? "Enviando..." : "Enviar solicitud"}
                </button>

                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Volver
                </button>
              </div>
            </form>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
