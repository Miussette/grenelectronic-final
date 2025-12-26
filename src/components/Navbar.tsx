// src/components/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Menu,
  ShoppingCart,
  Instagram,
  // Linkedin, Youtube
} from "lucide-react";
import { useCart } from "@/context/CartContext"; // 👈 usar contexto

type NavItem = { href: string; label: string };

const HOME_BASE = "/bienvenido";
const STORE_URL = "/tienda";
const SHOW_SHOP_CTA = true;

const NAV: NavItem[] = [
  { href: "/quienes_somos", label: "QUIÉNES SOMOS" },
  { href: "/competencias",  label: "COMPETENCIAS"  },
  { href: "/proyectos",     label: "PROYECTOS"     },
  { href: "#cotizaciones",  label: "COTIZACIONES"  },
  { href: "#contacto",      label: "CONTACTO"      },
  { href: "/indice-uv",     label: "ÍNDICE UV"     },
];

const SOCIAL = [
  { href: "https://instagram.com/GRENELECTRONIC", label: "Instagram", Icon: Instagram },
];

function normalizeHref(href: string) {
  return href.startsWith("#")
    ? ({ pathname: HOME_BASE, hash: href.slice(1) } as const)
    : href;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { count } = useCart(); // 👈 contador global del carrito

  // Detecta si estamos en la tienda
  const isStore = useMemo(() => {
    const p = router.asPath || router.pathname || "";
    return p.startsWith(STORE_URL);
  }, [router.asPath, router.pathname]);

  const renderNavItem = (item: NavItem, onClick?: () => void) => (
    <Link
      key={item.href}
      href={normalizeHref(item.href)}
      className="text-[13px] uppercase tracking-[0.12em] text-white/80 hover:text-white transition"
      onClick={onClick}
    >
      {item.label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f14]/95 backdrop-blur border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between py-3">
        {/* LOGO → /bienvenido */}
        <Link href={HOME_BASE} className="flex items-center gap-3" aria-label="Ir al inicio">
          <Image src="/logo.png" alt="Grene" width={44} height={44} className="rounded" />
          <span className="hidden sm:block font-extrabold tracking-wide">GRENELECTRONIC CHILE</span>
        </Link>

        {/* Menú desktop */}
        <nav className="hidden md:flex items-center gap-8 mx-auto">
          {NAV.map((i) => renderNavItem(i))}
        </nav>

        {/* DERECHA (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* En corporativo: mostrar CTA "Ir a Tienda" */}
          {!isStore && SHOW_SHOP_CTA && (
            <Link
              href={STORE_URL}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold"
              aria-label="Ir a Tienda"
            >
              <ShoppingCart size={18} aria-hidden className="shrink-0" />
              Ir a Tienda
            </Link>
          )}

          {/* Redes */}
          {SOCIAL.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
            >
              <Icon size={18} aria-hidden />
            </a>
          ))}

          {/* SOLO EN TIENDA: Carrito */}
          {isStore && (
            <Link
              href="/tienda/carrito"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15"
              aria-label="Carrito"
              title="Carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[10px] leading-[18px] text-center font-bold">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Burger (mobile) */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-white/10"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <Menu />
        </button>
      </div>

      {/* Menú mobile */}
      {open && (
        <div className="md:hidden border-t border-white/10">
          <div className="container mx-auto py-2 flex flex-col gap-2">
            {NAV.map((i) => renderNavItem(i, () => setOpen(false)))}

            <div className="flex items-center gap-3 py-2">
              {/* En corporativo: CTA a Tienda */}
              {!isStore && (
                <Link
                  href={STORE_URL}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  <ShoppingCart size={18} /> Ir a Tienda
                </Link>
              )}

              {/* Redes */}
              {SOCIAL.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} />
                </a>
              ))}

              {/* SOLO EN TIENDA: Carrito */}
              {isStore && (
                <Link
                  href="/tienda/carrito"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 ml-auto"
                  onClick={() => setOpen(false)}
                  aria-label="Carrito"
                  title="Carrito"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[10px] leading-[18px] text-center font-bold">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
