"use client";

import Image from "next/image";

export default function SectionQuienes() {
  return (
    <section id="quienes-somos" className="py-20 bg-black">
      <div className="container mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-10 items-center">
        {/* Columna texto */}
        <div>
          {/* Acento */}
          <span className="inline-block h-2 w-16 rounded bg-amber-500 mb-6" />

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Construyendo <br /> innovación
          </h2>

          <p className="mt-6 text-white/80 text-lg">
            En <strong>Grenelectronic</strong> integramos electrónica, electricidad y señalética
            para entregar soluciones reales a pymes e industrias. Diseñamos, abastecemos
            e implementamos proyectos con enfoque en calidad, escalabilidad y mantenimiento.
          </p>

          <p className="mt-4 text-white/80">
            Desde nuestra experiencia hemos desarrollado decenas de soluciones
            para rubros como comercio, educación, industria ligera y servicios.
            Nuestro know-how nos permite proponer alternativas robustas, medibles y rentables.
          </p>

          {/* Bullets (ajústalos si quieres) */}
          <ul className="mt-6 space-y-2 text-white/80">
            <li>• Señalética y pantallas LED a medida.</li>
            <li>• Componentes electrónicos y eléctricos con soporte.</li>
            <li>• Cableado, tableros y control básico/industrial.</li>
            <li>• Cotizaciones rápidas y postventa confiable.</li>
          </ul>

          {/* Misión */}
          
        </div>

        {/* Columna imagen */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Reemplaza /images/quienes.jpg por tu imagen real */}
            <Image
              src="/images/quienes.jpg"
              alt="Equipo trabajando en mesa de electrónica"
              width={1200}
              height={900}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
