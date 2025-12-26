import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { wpGql } from "@/lib/wp";
import { QUERY_PRODUCTS, QUERY_CATEGORIES } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton";

type Product = {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  type: string;
  description?: string | null;
  shortDescription?: string | null;
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  stockQuantity?: number | null;
  stockStatus?: string | null;
  image?: { sourceUrl?: string; altText?: string | null };
  productCategories?: {
    nodes: Array<{ slug: string; name: string }>;
  };
};
type Category = { id: string; name: string; slug: string };

type Props = {
  q: string;
  c: string;
  tipo: string;
  after: string | null;
  cats: Category[];
  products: { nodes: Product[]; pageInfo: { hasNextPage: boolean; endCursor?: string | null } };
};

export default function TiendaPage({ q, c, tipo, after, cats, products }: Props) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<string>("default");

  // Mostrar loading cuando cambia la ruta
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events?.on("routeChangeStart", handleStart);
    router.events?.on("routeChangeComplete", handleComplete);
    router.events?.on("routeChangeError", handleComplete);

    return () => {
      router.events?.off("routeChangeStart", handleStart);
      router.events?.off("routeChangeComplete", handleComplete);
      router.events?.off("routeChangeError", handleComplete);
    };
  }, [router]);
  
  // Filtrar productos según el tipo
  let filteredProducts = products.nodes.filter((p) => {
    const isDesarrollo = p.productCategories?.nodes.some(cat => cat.slug === "desarrollo");
    const hasValidPrice = p.price && p.price !== "" && p.price !== "0";
    
    if (tipo === "venta") {
      // Venta inmediata: tiene precio Y NO es desarrollo
      return hasValidPrice && !isDesarrollo;
    }
    if (tipo === "cotizar") {
      // Para cotizar: no tiene precio O es desarrollo
      return !hasValidPrice || isDesarrollo;
    }
    return true; // Mostrar todos
  });

  // Ordenar productos según el filtro seleccionado
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        // Precio menor a mayor
        const priceA = parseFloat(a.price || "0");
        const priceB = parseFloat(b.price || "0");
        return priceA - priceB;
      
      case "price-desc":
        // Precio mayor a menor
        const priceA2 = parseFloat(a.price || "0");
        const priceB2 = parseFloat(b.price || "0");
        return priceB2 - priceA2;
      
      case "name-asc":
        // Nombre A-Z
        return a.name.localeCompare(b.name, "es");
      
      case "name-desc":
        // Nombre Z-A
        return b.name.localeCompare(a.name, "es");
      
      default:
        // Sin ordenamiento
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-4xl font-bold text-black">Tienda</h1>
        <p className="text-gray-600 mt-1 mb-6">Explora categorías y cotiza productos.</p>

        {/* Botón para mostrar/ocultar sidebar - fuera del flex */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft size={18} />
              Ocultar filtros
            </>
          ) : (
            <>
              <ChevronRight size={18} />
              Mostrar filtros
            </>
          )}
        </button>

        <div className="flex gap-8">
          {/* Barra lateral */}
          {sidebarOpen && (
            <aside className="w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
              {/* Tipo de producto */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-black mb-3">Tipo de compra</h3>
                <form method="GET" className="space-y-2">
                  <input type="hidden" name="q" value={q} />
                  <input type="hidden" name="c" value={c} />
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      value=""
                      defaultChecked={!tipo}
                      onChange={(e) => e.target.form?.submit()}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-gray-700">Todos</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      value="venta"
                      defaultChecked={tipo === "venta"}
                      onChange={(e) => e.target.form?.submit()}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-gray-700">Venta inmediata</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      value="cotizar"
                      defaultChecked={tipo === "cotizar"}
                      onChange={(e) => e.target.form?.submit()}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-gray-700">Para cotizar</span>
                  </label>
                </form>
              </div>

              {/* Categorías */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-black mb-3">Categorías</h3>
                <div className="space-y-2">
                  <Link
                    href={{ pathname: "/tienda", query: { q, tipo } }}
                    className={`block text-sm ${!c ? "text-emerald-600 font-semibold" : "text-gray-600 hover:text-emerald-600"}`}
                  >
                    Todas
                  </Link>
                  {cats.map((cat) => (
                    <Link
                      key={cat.id}
                      href={{ pathname: "/tienda", query: { q, c: cat.slug, tipo } }}
                      className={`block text-sm ${c === cat.slug ? "text-emerald-600 font-semibold" : "text-gray-600 hover:text-emerald-600"}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          )}

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Filtros de búsqueda */}
            <form className="mb-6 flex gap-3" method="GET">
              <input type="hidden" name="c" value={c} />
              <input type="hidden" name="tipo" value={tipo} />
              <input
                name="q"
                defaultValue={q}
                placeholder="Buscar por nombre…"
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2 text-black"
              />
              <button className="rounded-xl bg-emerald-600 px-6 py-2 font-semibold text-white hover:bg-emerald-700">
                Buscar
              </button>
            </form>

            {/* Barra de ordenamiento */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
              </p>
              
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-gray-600">
                  Ordenar por:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-black focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="default">Predeterminado</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name-asc">Nombre: A - Z</option>
                  <option value="name-desc">Nombre: Z - A</option>
                </select>
              </div>
            </div>

            {/* Grid de productos */}
            <section className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {isLoading ? (
                // Mostrar skeletons mientras carga
                Array.from({ length: 10 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
                  No se encontraron productos con estos filtros.
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <ProductCard 
                    key={p.slug} 
                    slug={p.slug} 
                    name={p.name} 
                    price={p.price} 
                    image={p.image}
                    categories={p.productCategories?.nodes || []}
                  />
                ))
              )}
            </section>

            {/* Paginación */}
            {products.pageInfo.hasNextPage && (
              <div className="mt-8 flex justify-center">
                <Link
                  href={{
                    pathname: "/tienda",
                    query: { q, c, tipo, after: products.pageInfo.endCursor ?? "" },
                  }}
                  className="rounded-xl border px-4 py-2 hover:bg-black/5"
                >
                  Cargar más
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const q = (query.q as string) || "";
  const c = (query.c as string) || "";
  const tipo = (query.tipo as string) || "";
  const after = ((query.after as string) || null) as string | null;

  try {
    // Solo traer categorías si no hay filtros (cacheable)
    const shouldFetchProducts = !q && !c && !after;
    
    const [catsResp, prodsResp] = await Promise.all([
      wpGql<{ productCategories: { nodes: Category[] } }>(QUERY_CATEGORIES),
      wpGql<{ products: { nodes: Product[]; pageInfo: { hasNextPage: boolean; endCursor?: string | null } } }>(
        QUERY_PRODUCTS,
        {
          search: q || null,
          cat: c ? [c] : null,
          first: shouldFetchProducts ? 50 : 12, // Más productos en primera carga
          after,
        }
      ),
    ]);

    return {
      props: {
        q,
        c,
        tipo,
        after,
        cats: catsResp.productCategories.nodes,
        products: prodsResp.products,
      },
    };
  } catch (error) {
    console.error("Error cargando datos de WooCommerce:", error);
    // Retornar datos vacíos si falla la conexión
    return {
      props: {
        q,
        c,
        tipo,
        after,
        cats: [],
        products: { nodes: [], pageInfo: { hasNextPage: false } },
      },
    };
  }
};
