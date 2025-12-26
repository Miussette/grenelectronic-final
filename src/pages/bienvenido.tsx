import Head from "next/head";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";


import Cotizaciones from "../components/Cotizaciones";
import Contacto from "../components/Contacto";
import PartnersCarousel from "../components/PartnersCarousel";
import Footer from "../components/Footer";

// 👇 secciones nuevas
import Mision from "@/components/sections/Mision";
import PorQue from "@/components/sections/PorQue";
import Proceso from "@/components/sections/Proceso";

export default function BienvenidoPage() {
  return (
    <>
      <Head>
        <title>Bienvenido | Grenelectronic Chile</title>
      </Head>

      <Navbar />
      <main>
        <Hero />

       

        

        {/* 👇 NUEVO: bloques entre Proyectos y Cotizaciones */}
        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <Mision />
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <PorQue />
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <Proceso />
          </div>
        </section>

        <section id="cotizaciones" className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <Cotizaciones />
          </div>
        </section>

        <section id="contacto" className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <Contacto />
          </div>
        </section>

        <PartnersCarousel />
      </main>
      <Footer />
    </>
  );
}
