import type { FC } from "react";

const Mision: FC = () => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
    <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide">Nuestra misión</h2>
    <p className="mt-3 text-white/80 leading-relaxed">
      Impulsamos a pymes e industrias en Chile, con soluciones tecnológicas
      accesibles y de alta calidad. Integramos
      electrónica, electricidad y señalética para convertir tus ideas en
      instalaciones reales, seguras y escalables. Hacemos que la tecnología
      funcione para tu negocio: combinamos
      productos probados, ingeniería e integración para llevar cada proyecto
      del plano a la operación sin sorpresas, con
      plazos claros, calidad medible y postventa real.
      <br className="hidden md:block" />
      <span className="block mt-2">
        Diseñamos e implementamos soluciones que sí se ejecutan, a tiempo y con
        soporte cercano.
      </span>
    </p>
  </div>
);

export default Mision;
