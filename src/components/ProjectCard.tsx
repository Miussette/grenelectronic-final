import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/project";

type Props = {
  project: Project;
  className?: string;
  priority?: boolean;
};

export default function ProjectCard({ project, className = "", priority = false }: Props) {
  const { slug, title, summary, cover, tags, client, industry, year } = project;

  const cardClass =
    "group block rounded-2xl overflow-hidden border border-white/10 bg-white/5 " +
    "hover:bg-white/[0.08] transition-all duration-200 focus:outline-none " +
    "focus:ring-2 focus:ring-emerald-400/50 " +
    className;

  return (
    <Link href={`/proyectos/${slug}`} aria-label={`Ver proyecto: ${title}`} className={cardClass}>
      {/* Imagen */}
      <div className="relative aspect-[16/9] bg-neutral-900">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          priority={priority}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="p-4">
        {(client || industry || year) && (
          <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-white/70">
            {client && (
              <span>
                <span className="text-white/60">Cliente: </span>
                <span className="font-medium">{client}</span>
              </span>
            )}
            {industry && (
              <span>
                <span className="text-white/60">Industria: </span>
                <span className="font-medium">{industry}</span>
              </span>
            )}
            {year && (
              <span>
                <span className="text-white/60">Año: </span>
                <span className="font-medium">{year}</span>
              </span>
            )}
          </div>
        )}

        <h3 className="font-semibold leading-tight">{title}</h3>
        <p className="mt-1 text-sm text-white/75 line-clamp-2">{summary}</p>

        {tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 6).map((t) => (
              <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-white/10 border border-white/10">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4 text-xs font-medium text-emerald-300/90 group-hover:text-emerald-300 transition-colors">
          Ver detalles →
        </div>
      </div>
    </Link>
  );
}
