import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Phone, Mail, MapPin, CreditCard, RefreshCw, FileText,
  Instagram, PhoneCall
} from "lucide-react";

const PHONE_DISPLAY = "+56 2 2476 0928";
const PHONE_TEL = "+56224760928";

// Si quieres WhatsApp directo, pon tu número sin '+'
const WHATSAPP = "56900000000";
const WA_LINK = `https://wa.me/${WHATSAPP}?text=Hola,%20quisiera%20consultar%20stock`;

// Si tu landing no está en '/', cambia por '/bienvenido'
const HOME_BASE = "/";

/** Para anchors (#) desde cualquier página, navega a /#seccion */
function normalizeHref(href: string) {
  return href?.startsWith("#")
    ? ({ pathname: HOME_BASE, hash: href.slice(1) } as const)
    : href;
}

export default function Footer() {
  const { pathname } = useRouter();
  const isShop = pathname.startsWith("/tienda");

  return (
    <footer className="bg-[#121516] text-white/80">
      {/* --- Tira superior (features) SOLO TIENDA (tema blanco + verde) --- */}
      {isShop && (
        <div className="bg-white">
          <div className="container grid md:grid-cols-3 gap-8 py-12">
            <ShopFeature
              Icon={FileText}
              title="ASISTENCIA"
              desc="Equipo de especialistas con amplia experiencia para asistencia post venta."
            />
            <ShopFeature
              Icon={CreditCard}
              title="MEDIOS DE PAGO"
              desc="Webpay para compras online o transferencia bancaria."
            />
            <ShopFeature
              Icon={RefreshCw}
              title="DEVOLUCIONES"
              desc="Productos en excelente estado y con su empaque original."
            />
          </div>
        </div>
      )}

      {/* --- Cuerpo principal --- */}
      <div className="container grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 py-12">
        {/* Marca */}
        <div className="space-y-4">
          <Link href={HOME_BASE} className="flex items-center gap-3">
            <Image src="/logo.png" alt="Grene" width={44} height={44} />
            <span className="font-extrabold tracking-wide text-white">
              GRENE ELECTRONIC
            </span>
          </Link>
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Grene Electronic.<br />
            Todos los derechos reservados.
          </p>
        </div>

        {/* Acceso rápido (corporativo) */}
        <FooterCol
          title="ACCESO RÁPIDO"
          items={[
            { label: "Quiénes Somos", href: "#quienes" },
            { label: "Competencias", href: "#competencias" },
            { label: "Clientes", href: "#clientes" },
            { label: "Contacto", href: "#contacto" },
          ]}
        />

        {/* Categorías (tienda) */}
        <FooterCol
          title="CATEGORÍAS"
          items={[
            { label: "Ferretería", href: "/tienda" },
            { label: "Electricidad", href: "/tienda" },
            { label: "Electrónica", href: "/tienda" },
            { label: "Ver Todos", href: "/tienda" },
          ]}
        />

        {/* Consulta stock */}
        <div>
          <h4 className="text-white font-bold tracking-wide mb-4">
            CONSULTA STOCK
          </h4>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <PhoneCall />
            </div>
            <div className="text-sm">
              <div className="text-white/70">LLÁMANOS AL</div>
              <a className="hover:text-white font-semibold" href={`tel:${PHONE_TEL}`}>
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href={normalizeHref("#contacto")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:border-white/40"
            >
              CONTÁCTANOS
            </Link>
          </div>
        </div>

        {/* Formas de pago + Info contacto + Redes */}
        <div>
          <h4 className="text-white font-bold tracking-wide mb-4">FORMAS DE PAGO</h4>
          <ul className="text-sm space-y-1 text-white/70 mb-6">
            <li>Tarjetas Crédito / Débito</li>
            <li>Transferencia bancaria</li>
          </ul>

          <h4 className="text-white font-bold tracking-wide mb-3">
            INFORMACIÓN DE CONTACTO
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-1" />
              <span>El Greco 550, RM, Chile</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} />
              <a className="hover:text-white" href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} />
              <a className="hover:text-white" href="mailto:contacto@grenelectronic.cl">
                contacto@grenelectronic.cl
              </a>
            </li>
          </ul>

          <h4 className="text-white font-bold tracking-wide mt-6 mb-3">
            SÍGUENOS
          </h4>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/GRENELECTRONIC"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Franja final */}
      <div className="border-t border-white/10">
        <div className="container py-4 text-xs text-white/50 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <span>Desarrollado con ♥ por Grene Electronic</span>
          <a href={WA_LINK} target="_blank" rel="noreferrer" className="underline hover:text-white">
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Subcomponentes ---------- */

function Feature({
  Icon, title, desc,
}: { Icon: React.ComponentType<{ size?: number }>; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 grid place-content-center">
        <Icon />
      </div>
      <div className="text-white font-bold">{title}</div>
      <div className="text-white/70 text-sm max-w-xs">{desc}</div>
    </div>
  );
}

/** Variante para TIENDA: blanco + verde */
function ShopFeature({
  Icon, title, desc,
}: { Icon: React.ComponentType<{ size?: number }>; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 text-emerald-700">
      <div className="h-16 w-16 rounded-full grid place-content-center
                      bg-emerald-50 ring-1 ring-emerald-200 text-emerald-700">
        <Icon />
      </div>
      <div className="font-extrabold tracking-wide">{title}</div>
      <div className="text-sm opacity-80 max-w-xs">{desc}</div>
    </div>
  );
}

function FooterCol({
  title, items,
}: { title: string; items: { label: string; href?: string }[] }) {
  return (
    <div>
      <h4 className="text-white font-bold tracking-wide mb-4">{title}</h4>
      <ul className="space-y-2 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-white/30">▸</span>
            {it.href ? (
              <Link href={normalizeHref(it.href)} className="hover:text-white">
                {it.label}
              </Link>
            ) : (
              <span className="text-white/70">{it.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
