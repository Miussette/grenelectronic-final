function FilterBar({
  q,
  category,
  categories,
}: {
  q?: string;
  category?: string;
  categories: string[];
}) {
  return (
    <form className="mt-6" method="get">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Buscar: ocupa más ancho */}
        <div className="sm:col-span-6 lg:col-span-7">
          <label htmlFor="q" className="sr-only">Buscar</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
              {/* ícono lupa */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              id="q"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Buscar por nombre…"
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-neutral-300 bg-white text-neutral-900
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60"
            />
          </div>
        </div>

        {/* Categoría */}
        <div className="sm:col-span-4 lg:col-span-3">
          <label htmlFor="category" className="sr-only">Categoría</label>
          <select
            id="category"
            name="category"
            defaultValue={category ?? ""}
            className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-neutral-900
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Acciones */}
        <div className="sm:col-span-2 lg:col-span-2 flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center flex-1 px-4 py-2 rounded-xl
                       bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition"
          >
            Filtrar
          </button>
          {/* Limpia filtros */}
          {(q || category) && (
            <button
              type="button"
              onClick={() => window.location.href = '/tienda'}
              className="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-neutral-300
                         text-neutral-700 bg-white hover:bg-neutral-50 transition"
              title="Limpiar filtros"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
