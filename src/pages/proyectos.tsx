import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

export default function ProyectosPage() {
  return (
    <>
      <Head>
        <title>Proyectos | Grenelectronic</title>
        <meta
          name="description"
          content="Casos de éxito y proyectos de Grenelectronic en electrónica, electricidad y señalética."
        />
      </Head>

      <Navbar />

      <main>
        {/* Encabezado */}
        <section className="bg-black py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <span className="inline-block h-2 w-16 rounded bg-amber-500 mb-6" />
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Proyectos</h1>
            <p className="mt-4 text-white/80 max-w-3xl">
              Selección de proyectos en los que hemos diseñado, implementado y dado soporte.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="section container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p: Project, i) => (
              <ProjectCard key={p.slug} project={p} priority={i < 3} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
