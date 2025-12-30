import type { NextApiRequest, NextApiResponse } from "next";
import { wpGql } from "@/lib/wp";
import { QUERY_PRODUCTS } from "@/lib/queries";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const q = (req.query.q as string) || (req.query.search as string) || "";
  try {
    const data = await wpGql<any>(QUERY_PRODUCTS, { search: q, first: 20 });
    const nodes = data?.products?.nodes ?? [];
    const simplified = nodes.map((n: any) => ({
      id: n.databaseId ?? n.id,
      name: n.name,
      price: (n.price !== undefined && n.price !== null && n.price !== '') ? Number(n.price) : null,
      slug: n.slug,
    }));
    // If some products lack price from GraphQL, try to fetch price from WooCommerce REST API (uses DB id)
    const WC_BASE = process.env.NEXT_PUBLIC_WC_BASE;
    const WC_KEY = process.env.WC_KEY;
    const WC_SECRET = process.env.WC_SECRET;

    if (WC_BASE && WC_KEY && WC_SECRET) {
      const needPrice = simplified.filter((p: any) => (p.price === null || p.price === undefined) && Number(p.id));
      if (needPrice.length > 0) {
        try {
          const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
          await Promise.all(needPrice.map(async (p: any) => {
            try {
              // Try by numeric id first
              let prod: any = null;
              if (Number(p.id)) {
                const r = await fetch(`${WC_BASE}/wp-json/wc/v3/products/${p.id}`, {
                  headers: { Authorization: `Basic ${auth}` },
                });
                if (r.ok) prod = await r.json();
              }

              // If not found by id, try by slug
              if (!prod && p.slug) {
                const r2 = await fetch(`${WC_BASE}/wp-json/wc/v3/products?slug=${encodeURIComponent(p.slug)}`, {
                  headers: { Authorization: `Basic ${auth}` },
                });
                if (r2.ok) {
                  const arr = await r2.json();
                  if (Array.isArray(arr) && arr.length > 0) prod = arr[0];
                }
              }

              const price = prod?.price ?? prod?.regular_price ?? null;
              if (price !== undefined && price !== null && price !== '') {
                p.price = Number(price);
              }
            } catch (e) {
              // ignore per-product errors
            }
          }));
        } catch (e) {
          console.error('[api/admin/products] error fetching from WC REST', e);
        }
      }
    }

    return res.status(200).json({ ok: true, products: simplified });
  } catch (e) {
    console.error("[api/admin/products]", e);
    return res.status(500).json({ ok: false, error: "Error fetching products" });
  }
}
