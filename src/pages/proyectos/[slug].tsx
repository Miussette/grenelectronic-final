import Head from "next/head";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

type Props = { project: Project | null };

export default function ProjectDetail({ project }: Props) {
  if (!project) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto max-w-6xl px-4 py-20">
          <h1 className="text-2xl font-bold">Proyecto no encontrado</h1>
          <p className="mt-2 text-white/70">Revisa el enlace o vuelve al listado.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{project.title} | Grenelectronic Chile</title>
        <meta name="description" content={project.summary} />
      </Head>

      <Navbar />

      <main>
        {/* Encabezado */}
        <section className="bg-black py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <span className="inline-block h-2 w-16 rounded bg-amber-500 mb-6" />
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{project.title}</h1>
            {(project.client || project.industry || project.year) && (
              <div className="mt-2 text-sm text-white/75 space-x-5">
                {project.client && <span><b>Cliente:</b> {project.client}</span>}
                {project.industry && <span><b>Industria:</b> {project.industry}</span>}
                {project.year && <span><b>Año:</b> {project.year}</span>}
              </div>
            )}
          </div>
        </section>

        {/* Imagen + resumen */}
        <section className="py-8">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="relative w-full max-h-[70vh] bg-white rounded-2xl overflow-auto">
              <Image
                src={project.datasheetImage ?? project.cover}
                alt={project.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <p className="text-xs text-center mt-2 opacity-70 tracking-wide"></p>

            <p className="mt-6 text-white/90 leading-relaxed">{project.summary}</p>

            {project.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-white/10 border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            {/* ESPECIFICACIONES INLINE */}
            {(project.specs || project.environment || project.installation || project.applications?.length || project.dataExample) && (
              <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Columna 1: Specs */}
                {project.specs && (
                  <div className="rounded-xl border border-white/10 p-5">
                    <h3 className="text-lg font-semibold mb-4">Características técnicas</h3>
                    <ul className="space-y-2 text-sm">
                      {project.specs.panelResolution && (
                        <li>
                          <strong>Resolución del panel:</strong>{" "}
                          {project.specs.panelResolution.width} × {project.specs.panelResolution.height}{" "}
                          {project.specs.panelResolution.unit ?? "px"}
                        </li>
                      )}
                      {project.specs.physicalSize && (
                        <li>
                          <strong>Dimensiones físicas:</strong>{" "}
                          {project.specs.physicalSize.width} × {project.specs.physicalSize.height}
                          {project.specs.physicalSize.depth ? ` × ${project.specs.physicalSize.depth}` : ""}{" "}
                          {project.specs.physicalSize.approx ? "(aprox.)" : ""}
                        </li>
                      )}
                      {project.specs.ledType && <li><strong>Tipo de LED:</strong> {project.specs.ledType}</li>}
                      {project.specs.pixelPitch && <li><strong>Pitch:</strong> {project.specs.pixelPitch}</li>}
                      {project.specs.controller && <li><strong>Controlador:</strong> {project.specs.controller}</li>}
                      {project.specs.connectivity?.length && (
                        <li><strong>Conectividad:</strong> {project.specs.connectivity.join(", ")}</li>
                      )}
                      {project.specs.protocol && <li><strong>Protocolo:</strong> {project.specs.protocol}</li>}
                      {project.specs.powerInput?.length && (
                        <li><strong>Alimentación:</strong> {project.specs.powerInput.join(" / ")}</li>
                      )}
                      {project.specs.maxPower && <li><strong>Consumo máximo:</strong> {project.specs.maxPower}</li>}
                      {project.specs.protection && (
                        <li>
                          <strong>Protección:</strong> Frontal {project.specs.protection.front ?? "-"}
                          {project.specs.protection.back ? ` / Posterior ${project.specs.protection.back}` : ""}
                        </li>
                      )}
                      {project.specs.warranty && <li><strong>Garantía:</strong> {project.specs.warranty}</li>}
                      {project.specs.softwareIncluded && (
                        <li><strong>Software incluido:</strong> {project.specs.softwareIncluded}</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Columna 2: Operación / instalación / usos / ejemplo */}
                {(project.environment || project.installation || project.applications?.length || project.dataExample) && (
                  <div className="rounded-xl border border-white/10 p-5">
                    <h3 className="text-lg font-semibold mb-4">Operación e instalación</h3>
                    <ul className="space-y-2 text-sm">
                      {project.environment?.operatingTemp && (
                        <li>
                          <strong>Temperatura de operación:</strong>{" "}
                          {project.environment.operatingTemp.min} a {project.environment.operatingTemp.max}
                        </li>
                      )}
                      {project.environment?.humidity && (
                        <li><strong>Humedad relativa:</strong> {project.environment.humidity}</li>
                      )}
                      {project.environment?.cabinet && (
                        <li><strong>Gabinete:</strong> {project.environment.cabinet}</li>
                      )}
                      {project.installation?.method && (
                        <li><strong>Método de instalación:</strong> {project.installation.method}</li>
                      )}
                    </ul>

                    {project.applications?.length ? (
                      <>
                        <h4 className="text-base font-semibold mt-6 mb-2">Aplicaciones típicas</h4>
                        <ul className="list-disc ml-5 text-sm space-y-1">
                          {project.applications.map((a) => <li key={a}>{a}</li>)}
                        </ul>
                      </>
                    ) : null}

                    {project.dataExample && (
                      <>
                        <h4 className="text-base font-semibold mt-6 mb-2">Ejemplo de dato</h4>
                        <code className="block text-sm bg-white/10 border border-white/10 rounded-md px-3 py-2">
                          IN: {project.dataExample.command}<br />
                          OUT: {project.dataExample.displayOutput}
                        </code>
                        {project.dataExample.notes && (
                          <p className="text-xs mt-2 opacity-70">{project.dataExample.notes}</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </section>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* Rutas estáticas */
export async function getStaticPaths() {
  return {
    paths: projects.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug) ?? null;
  return { props: { project } };
}
