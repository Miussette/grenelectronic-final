import type { FC } from "react";
import { ShieldCheck, Wrench, Clock8, Headset } from "lucide-react";

const items = [
  { title: "Calidad y seguridad", desc: "Componentes confiables y normas.", Icon: ShieldCheck },
  { title: "Ingeniería + integración", desc: "Diseño, suministro e implementación.", Icon: Wrench },
  { title: "Plazos reales", desc: "Planificación clara y entrega a tiempo.", Icon: Clock8 },
  { title: "Soporte cercano", desc: "Postventa remoto y on-site.", Icon: Headset },
];

const PorQue: FC = () => (
  <div aria-labelledby="pq-title">
    <h2 id="pq-title" className="text-2xl md:text-3xl font-extrabold tracking-wide">¿Por qué elegirnos?</h2>
    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map(({ title, desc, Icon }) => (
        <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 grid place-content-center">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="font-semibold">{title}</h3>
          </div>
          <p className="text-sm text-white/70">{desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default PorQue;
