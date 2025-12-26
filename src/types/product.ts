
export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
};

export type Product = {
  id: number;
  sku?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  price: number | null;
  currency?: string | null;
  stock?: number | null;
  status: "publish" | "draft";
  category_id?: number | null;
  image_urls?: string[] | null;
};
