import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Competencias from "../components/Competencias";

export default function CompetenciasPage() {
  return (
    <>
      <Head>
        <title>Competencias | Grenelectronic</title>
        <meta
          name="description"
          content="Redes, seguridad electrónica, infraestructura TI, cloud & email, automatización y soporte."
        />
      </Head>

      <Navbar />

      <main>
        <section className="bg-black py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <span className="inline-block h-2 w-16 rounded bg-amber-500 mb-6" />
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Competencias</h1>
            <p className="mt-4 text-white/80 max-w-3xl">
              Capacidades técnicas para diseñar, implementar y mantener soluciones robustas
              en conectividad, seguridad electrónica e infraestructura TI.
            </p>
          </div>
        </section>

        <section className="section container">
          <Competencias />
        </section>
      </main>

      <Footer />
    </>
  );
}
