// components/Proyectos.tsx
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

export default function Proyectos() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Proyectos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((p: Project) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
