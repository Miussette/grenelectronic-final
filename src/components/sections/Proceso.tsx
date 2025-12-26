import type { FC } from "react";
import { ClipboardList, CircuitBoard, PackageCheck, LifeBuoy } from "lucide-react";

const steps = [
  { n: "01", title: "Levantamiento", desc: "Requerimientos y medidas.", Icon: ClipboardList },
  { n: "02", title: "Diseño + propuesta", desc: "Materiales y plazos definidos.", Icon: CircuitBoard },
  { n: "03", title: "Implementación", desc: "Instalación y pruebas.", Icon: PackageCheck },
  { n: "04", title: "Entrega + soporte", desc: "Documentación y postventa.", Icon: LifeBuoy },
];

const Proceso: FC = () => (
  <div aria-labelledby="proc-title">
    <h2 id="proc-title" className="text-2xl md:text-3xl font-extrabold tracking-wide">Proceso de trabajo</h2>
    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {steps.map(({ n, title, desc, Icon }) => (
        <div key={n} className="rounded-2xl border border-white/10 bg-white/5 p-5 relative overflow-hidden">
          <span className="absolute right-4 top-3 text-5xl font-black text-white/5 select-none">{n}</span>
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

export default Proceso;
