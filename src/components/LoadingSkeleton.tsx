export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden animate-pulse">
      {/* Imagen skeleton */}
      <div className="h-48 bg-gray-200" />
      
      {/* Contenido skeleton */}
      <div className="p-4">
        {/* Título */}
        <div className="h-10 bg-gray-200 rounded mb-3" />
        
        {/* Precio */}
        <div className="h-16 mb-3">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
        
        {/* Botones */}
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function TiendaLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar placeholder */}
      <div className="h-16 bg-gray-900" />
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Título skeleton */}
        <div className="animate-pulse mb-8">
          <div className="h-10 bg-gray-200 rounded w-48 mb-2" />
          <div className="h-6 bg-gray-200 rounded w-96" />
        </div>

        {/* Botón filtros skeleton */}
        <div className="animate-pulse mb-4">
          <div className="h-10 bg-gray-200 rounded w-40" />
        </div>

        <div className="flex gap-8">
          {/* Sidebar skeleton */}
          <aside className="w-64 flex-shrink-0 space-y-4">
            <div className="animate-pulse rounded-2xl border border-gray-200 p-4">
              <div className="h-6 bg-gray-200 rounded w-32 mb-3" />
              <div className="space-y-2">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
            
            <div className="animate-pulse rounded-2xl border border-gray-200 p-4">
              <div className="h-6 bg-gray-200 rounded w-32 mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
            </div>
          </aside>

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Barra de búsqueda skeleton */}
            <div className="animate-pulse mb-6 flex gap-3">
              <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
              <div className="w-24 h-12 bg-gray-200 rounded-xl" />
            </div>

            {/* Grid de productos skeleton */}
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
