import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
  slug: "DISPLAY-INDUSTRIAL-LED",
  title: "DISPLAY INDUSTRIAL LED (DIL1-1664-SE)",
  client: "SCORESHOW",
  year: "2025",
  industry: "Uso Industrial",
  tags: ["LED", "Electricidad", "Montaje"],
  summary:
    "Panel de visualización LED de uso industrial para información dinámica, señalización de procesos, advertencias de seguridad o monitoreo en línea. Con comunicación Ethernet para actualización de datos en tiempo real.",
  cover: "/proyectos/senaletica-led-1.png",
  gallery: [
    //"/proyectos/senaletica-led-1.png",
    //"/proyectos/senaletica-led-2.jpg",
  ],

  // 👇 NUEVO: datos técnicos tomados de la ficha
  specs: {
    panelResolution: { width: 64, height: 16, unit: "px" },
    physicalSize: { width: "70 cm", height: "22 cm", depth: "10 cm", approx: true },
    ledType: "Monocromático alto brillo (Rojo/Ámbar/Verde/Blanco)",
    pixelPitch: "10 mm",
    controller: "Integrado con microcontrolador industrial",
    connectivity: ["Serial"],          // la ficha también menciona Ethernet para actualización de datos
    protocol: "ASCII",
    powerInput: ["24V VCC", "12V VCC"],
    maxPower: "20 W",
    protection: { front: "IP65", back: "IP54" },
    warranty: "6 meses",
    softwareIncluded: "Configuración y testeo (compatible con Windows)",
  },

  // 👇 Ambiente de operación
  environment: {
    operatingTemp: { min: "-10°C", max: "+80°C" },
    humidity: "10% – 90% sin condensación",
    cabinet: "Acero con pintura electrostática y ventilación por diferencia",
  },

  // 👇 Instalación y montaje
  installation: {
    method: "Montaje mural o soporte metálico con pernos",
  },

  // 👇 Casos de uso (Aplicaciones típicas)
  applications: [
    "Señalización en plantas industriales",
    "Monitoreo de procesos o líneas de producción",
    "Alarmas visuales en faenas",
    "Indicadores de estado en tiempo real",
    "Display de turnos, temperatura, humedad y producción",
  ],

  // 👇 Ejemplo de dato/comando mostrado en la ficha
  dataExample: {
    command: "#HOLA123",
    displayOutput: "HOLA123",
    notes: "Protocolo ASCII; recepción por puerto serial.",
  },

  // (opcional) Imagen de la ficha técnica para detalle
  //datasheetImage: "/proyectos/datasheets/dil1-1664-se.png"
},
  
  {
    slug: "cctv-ip-planta",
    title: "CCTV/IP para planta de procesos",
    client: "Agroindustrial Z",
    year: "2023",
    industry: "Alimentos",
    tags: ["CCTV", "Redes", "Seguridad"],
    summary:
      "Implementación de 48 cámaras IP, NVR redundante y enlaces PoE. Segmentación de red (VLAN) y acceso remoto seguro.",
    cover: "/proyectos/cctv-planta.jpg",
    gallery: ["/proyectos/cctv-planta-1.jpg"],
  },
  {
    slug: "wifi-empresarial-campus",
    title: "Wi-Fi empresarial para campus",
    client: "Institución Y",
    year: "2023",
    industry: "Educación",
    tags: ["Wi-Fi", "VLAN", "QoS"],
    summary:
      "Despliegue de cobertura Wi-Fi para alta densidad con controladora, portales de acceso y políticas de QoS.",
    cover: "/proyectos/wifi-campus.jpg",
  },
];
