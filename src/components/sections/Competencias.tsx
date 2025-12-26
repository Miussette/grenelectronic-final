// src/components/sections/Competencias.tsx
export function SectionCompetencias() {
  const skills = [
    { t: "Redes & Conectividad", d: "Switching, routing, VLAN, Wi-Fi empresarial, QoS, monitoreo." },
    { t: "Seguridad Electrónica", d: "CCTV/IP, control de acceso, grabación, respaldo y analítica básica." },
    { t: "Infraestructura TI", d: "Cableado estructurado, racks, energía/UPS, servidores y virtualización." },
    { t: "Cloud & Email", d: "DNS, dominios .cl/.com, correo corporativo y políticas." },
    { t: "Automatización", d: "Inventario, alertas, tableros de disponibilidad." },
    { t: "Soporte & Mantenimiento", d: "Preventivo, correctivo, SLA remoto y on-site." },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {skills.map((s) => (
        <div key={s.t} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="font-semibold">{s.t}</h3>
          <p className="text-sm text-white/70 mt-1">{s.d}</p>
        </div>
      ))}
    </div>
  );
}
