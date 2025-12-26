// src/components/Contacto.tsx
"use client";

import type { FC } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Mail,
  CreditCard,
  Truck,
  MapPin,
  Clock,
  Instagram,
  AlertTriangle,
} from "lucide-react";

const EMAIL = "contacto@grenelectronic.cl" as const;

const PHONE_STORE = "224760928" as const;           // Teléfono de tienda (fijo)
const WSP_PROYECTOS = "+56965795754" as const;      // WhatsApp proyectos
const WSP_TIENDA = "+56954225000" as const;         // WhatsApp productos tienda

const ADDRESS = "El Greco 550, Maipú, Santiago" as const;
const GOOGLE_MAPS =
  "https://www.google.com/maps/search/?api=1&query=El+Greco+550,+Maip%C3%BA,+Santiago" as const;

// 👇 Con etiqueta para que LabelLine ponga <strong> a la izquierda
const OPEN_HOURS = "Horario: Lunes a Viernes · 09:00 a 18:00" as const;
const LUNCH_BREAK = "Colación: 13:00 a 14:00" as const;

const INSTAGRAM_URL = "https://instagram.com/GRENELECTRONIC" as const;

const Contacto: FC = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto max-w-6xl px-4 space-y-10">
        {/* Título + Email */}
        <header>
          <span className="inline-block h-2 w-16 rounded bg-amber-500 mb-4" />
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Contacto</h2>
          <p className="mt-2 text-white/80">
            Para proyectos electrónicos envía tu requerimiento a{" "}
            <Link href={`mailto:${EMAIL}`} className="underline decoration-white/40 hover:decoration-white">
              {EMAIL}
            </Link>.
          </p>
        </header>

        {/* Cards principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Teléfono de tienda"
            subtitle="Atención general"
            icon={<Phone className="w-5 h-5" aria-hidden="true" />}
            big
          >
            <Link href={`tel:${PHONE_STORE}`} className="text-2xl font-extrabold hover:underline">
              {PHONE_STORE}
            </Link>
          </Card>

          <Card
            title="Cotización proyectos"
            subtitle="WhatsApp"
            icon={<MessageCircle className="w-5 h-5" aria-hidden="true" />}
          >
            <ActionLink href={`https://wa.me/${WSP_PROYECTOS.replace("+", "")}`}>{WSP_PROYECTOS}</ActionLink>
          </Card>

          <Card
            title="Cotización productos de tienda"
            subtitle="WhatsApp / Fijo"
            icon={<MessageCircle className="w-5 h-5" aria-hidden="true" />}
          >
            <div className="flex flex-col gap-1">
              <ActionLink href={`https://wa.me/${WSP_TIENDA.replace("+", "")}`}>{WSP_TIENDA}</ActionLink>
              <ActionLink href={`tel:${PHONE_STORE}`}>{PHONE_STORE}</ActionLink>
            </div>
          </Card>

          <Card
            title="Correo"
            subtitle="Consultas y soporte"
            icon={<Mail className="w-5 h-5" aria-hidden="true" />}
          >
            <ActionLink href={`mailto:${EMAIL}`}>{EMAIL}</ActionLink>
          </Card>

          <Card
            title="Pagos en local"
            subtitle="No hay compra mínima"
            icon={<CreditCard className="w-5 h-5" aria-hidden="true" />}
          >
            <ul className="text-white/80 space-y-1">
              <li>• Transferencia o efectivo en local</li>
              <li>• Webpay <strong>solo para compras online</strong></li>
            </ul>
            <p className="mt-2 text-xs text-white/60">(Webpay no está disponible en tienda física)</p>
          </Card>

          <Card
            title="Envíos"
            subtitle="Por pagar"
            icon={<Truck className="w-5 h-5" aria-hidden="true" />}
          >
            <ul className="text-white/80 space-y-1">
              <li>• Agencia Chilexpress</li>
              <li>• Dirección o agencia Starken</li>
            </ul>
          </Card>

          <Card
            title="Tienda física"
            subtitle="Retiro y atención"
            icon={<MapPin className="w-5 h-5" aria-hidden="true" />}
          >
            <p className="text-white/80">
              <Link href={GOOGLE_MAPS} target="_blank" rel="noreferrer noopener" className="hover:underline">
                {ADDRESS}
              </Link>
            </p>
          </Card>

          <Card
            title="Horario"
            subtitle="Atención"
            icon={<Clock className="w-5 h-5" aria-hidden="true" />}
          >
            {/* 👇 Usamos LabelLine para poner en negrita el rótulo antes de ":" */}
            <LabelLine text={OPEN_HOURS} className="text-white/90" />
            <LabelLine text={LUNCH_BREAK} className="text-white/75" />
          </Card>

          <Card
            title="Instagram"
            subtitle="Solo referencias de proyectos"
            icon={<Instagram className="w-5 h-5" aria-hidden="true" />}
          >
            <ActionLink href={INSTAGRAM_URL}>@GRENELECTRONIC</ActionLink>
          </Card>
        </div>

        {/* Avisos / Políticas */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-500/20 p-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold tracking-wide">Importante</h3>
              <ul className="mt-2 space-y-1 text-white/80">
                <li>• <strong>NO se dan precios de proyectos por teléfono</strong>; solo por WhatsApp y/o correo.</li>
                <li>• Instagram se usa <strong>solo</strong> para referencias de proyectos.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Subcomponentes ---------- */

const Card: FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  big?: boolean;
  children: React.ReactNode;
}> = ({ title, subtitle, icon, big, children }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <div>
        <h4 className="font-semibold leading-tight">{title}</h4>
        {subtitle && <p className="text-xs text-white/60 leading-tight">{subtitle}</p>}
      </div>
    </div>
    <div className={big ? "text-2xl" : ""}>{children}</div>
  </div>
);

const ActionLink: FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link
    href={href}
    className="underline decoration-white/30 hover:decoration-white"
    target={href.startsWith("http") ? "_blank" : undefined}
    rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
  >
    {children}
  </Link>
);

// 👉 Utilitario para poner en <strong> todo lo anterior a ":"
type LabelLineProps = { text: string; className?: string };
const LabelLine: FC<LabelLineProps> = ({ text, className }) => {
  const i = text.indexOf(":");
  if (i === -1) return <p className={className}>{text}</p>;
  const label = text.slice(0, i).trim();
  const value = text.slice(i + 1).trim();
  return (
    <p className={className}>
      <strong>{label}:</strong> {value}
    </p>
  );
};

export default Contacto;
