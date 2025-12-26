import { GetStaticPaths, GetStaticProps } from "next";
import { wpGql } from "@/lib/wp";
import { QUERY_PRODUCT, QUERY_PRODUCT_SLUGS } from "@/lib/queries";
import Link from "next/link";

type Product = {
  slug: string;
  name: string;
  description?: string;
  image?: { sourceUrl?: string; altText?: string | null };
};

export default function ProductPage({ product }: { product: Product | null }) {
  if (!product) return <main className="p-6">Producto no encontrado.</main>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl overflow-hidden border">
          {product.image?.sourceUrl ? (
            <img src={product.image.sourceUrl} alt={product.image.altText ?? product.name} />
          ) : (
            <div className="h-64 bg-gray-100" />
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div
            className="prose mt-4 max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description ?? "" }}
          />
          <div className="mt-6 flex gap-3">
            <Link
              href="/tienda/cotizacion"
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Solicitar cotización
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await wpGql<{ products: { nodes: { slug: string }[] } }>(QUERY_PRODUCT_SLUGS);
  return {
    paths: data.products.nodes.map((p) => ({ params: { slug: p.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<{ product: Product | null }> = async ({ params }) => {
  const slug = params?.slug as string;
  const data = await wpGql<{ product: Product | null }>(QUERY_PRODUCT, { slug });
  return {
    props: { product: data.product ?? null },
    revalidate: 60, // ISR
  };
};
