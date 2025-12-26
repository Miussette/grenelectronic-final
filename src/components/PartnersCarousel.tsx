import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Partner = { src: string; alt: string; href?: string };

const partners: Partner[] = [
  { src: "/partners/achs.png", alt: "ACHS" },
  { src: "/partners/azul_horizontal.png", alt: "Municipalidad de Osorno" },
  { src: "/partners/foto_0000000120160830103208.png", alt: "Aduanas de Chile" },
  { src: "/partners/image (1).png", alt: "Codelco" },
  { src: "/partners/image (2).png", alt: "Grupo Minero Las Cenizas" },
  { src: "/partners/image (3).png", alt: "Collahuasi" },
  { src: "/partners/image (4).png", alt: "Romeral" },
  { src: "/partners/image (5).png", alt: "Anglo American" },
  { src: "/partners/image (6).png", alt: "CAP" },
  { src: "/partners/image (7).png", alt: "SQM" },
  { src: "/partners/image (8).png", alt: "AZA" },
  { src: "/partners/image (9).png", alt: "Shell" },
  { src: "/partners/image (10).png", alt: "GNL Chile" },
  { src: "/partners/image (11).png", alt: "Melón" },
  { src: "/partners/image (12).png", alt: "Agrosuper" },
  { src: "/partners/image (13).png", alt: "Cbb Cementos" },
  { src: "/partners/image (14).png", alt: "CMPC" },
  { src: "/partners/image (15).png", alt: "Mallplaza" },
  { src: "/partners/image (16).png", alt: "Armada de Chile" },
  { src: "/partners/image (17).png", alt: "Colo-Colo" },
  { src: "/partners/image (18).png", alt: "Cobresal" },
  { src: "/partners/image (19).png", alt: "MEGA" },
  { src: "/partners/image (20).png", alt: "TVN" },
  { src: "/partners/image.png", alt: "Minera Escondida" },
  { src: "/partners/images (1).png", alt: "IND" },
  { src: "/partners/images.png", alt: "Ministerio de Obras Públicas" },
  { src: "/partners/Junaeb-carrusel.webp", alt: "JUNAEB" },
  { src: "/partners/LAN_Airlines_logo.svg.png", alt: "LAN Airlines" },
  { src: "/partners/metro.png", alt: "Metro de Santiago" },
  { src: "/partners/marcaderecha.png", alt: "Marca Derecha" },
  { src: "/partners/Nuevo-logo-Sky-Airline.png", alt: "Sky Airline" },
];

// 🎨 Colores del gradiente y fades (ajústalos aquí)
const TOP_DARK    = "#0b0f14";
const MID_GRAY    = "#161a1d";
const BOTTOM_GRAY = "#2b3238";

// Velocidad del autoscroll (px por frame ~60fps)
const SCROLL_SPEED = 0.5;

export default function PartnersCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  // Duplicamos elementos para loop infinito
  const items = [...partners, ...partners];

  // Auto-scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const loop = () => {
      if (!paused) {
        el.scrollLeft += SCROLL_SPEED;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft = 0;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused]);

  const scrollBy = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.8) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section
      className="py-8 relative"
      style={{
        background: `linear-gradient(180deg, ${TOP_DARK} 0%, ${MID_GRAY} 55%, ${BOTTOM_GRAY} 100%)`,
      }}
    >
      <div className="container">
        <div className="relative">
          {/* fades laterales coordinados con el fondo */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-20"
            style={{ background: `linear-gradient(to right, ${TOP_DARK}, transparent)` }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-20"
            style={{ background: `linear-gradient(to left, ${BOTTOM_GRAY}, transparent)` }}
          />

          {/* controles */}
          <button
            aria-label="Anterior"
            onClick={() => scrollBy("left")}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10
                       hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            aria-label="Siguiente"
            onClick={() => scrollBy("right")}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10
                       hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <ChevronRight className="text-white" />
          </button>

          {/* carril */}
          <div
            ref={trackRef}
            className="overflow-x-auto no-scrollbar scroll-smooth"
            role="region"
            aria-roledescription="carrusel"
            aria-label="Logos de partners"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            <div className="flex items-center gap-10 px-6 py-3">
              {items.map((p, i) => (
                <div key={`${p.alt}-${i}`} className="shrink-0">
                  <img
                    src={encodeURI(p.src)}
                    alt={p.alt}
                    className="h-10 md:h-12 w-auto object-contain opacity-90 hover:opacity-100 transition
                               drop-shadow-sm brightness-[1.06] contrast-110"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
