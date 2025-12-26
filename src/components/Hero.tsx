// src/components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0b0f14]">
      <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Diseño e ingeniería, una
          
          unión sólida
        </h1>

        <p className="mt-6 max-w-2xl text-white/80">
          Creatividad y precisión técnica en un proceso estandarizado. Soluciones en
          electricidad, electrónica y ferretería para la industria.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {/* 👉 lleva a la página de Proyectos */}
          <Link
            href="/proyectos"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold
                       bg-emerald-600 hover:bg-emerald-700 text-white transition"
          >
            Proyectos
          </Link>

          {/* Ancla a Contacto, funciona desde cualquier página */}
          <Link
            href="/#contacto"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold
                       border border-white/20 hover:border-white/40 text-white transition"
          >
            Contáctanos
          </Link>
        </div>
      </div>

      {/* (opcional) tu degradado/imagen de fondo si lo tenías */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-emerald-600/35" />
    </section>
  );
}
