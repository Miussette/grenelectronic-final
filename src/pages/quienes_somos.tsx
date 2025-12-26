import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionQuienes from "../components/sections/SectionQuienes";

export default function QuienesSomosPage() {
  return (
    <>
      <Head>
        <title>Quiénes somos | Grenelectronic</title>
        <meta
          name="description"
          content="Conoce nuestra historia, misión y cómo integramos electrónica, electricidad y señalética para entregar soluciones robustas y escalables."
        />
      </Head>

      <Navbar />

      <main>
        {/* Hero/encabezado simple */}
        <section className="bg-black py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <span className="inline-block h-2 w-16 rounded bg-amber-500 mb-6" />
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Quiénes somos
            </h1>
            <p className="mt-4 text-white/80 max-w-3xl">
              Integramos electrónica, electricidad y señalética para impulsar proyectos
              de pymes e industrias con foco en calidad, escalabilidad y soporte.
            </p>
          </div>
        </section>

        {/* Bloque principal (texto izq + imagen der) */}
        <SectionQuienes />
      </main>

      <Footer />
    </>
  );
}
