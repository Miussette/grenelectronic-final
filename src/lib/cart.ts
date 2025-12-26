export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image_url?: string | null;
  sku?: string | null;
};

const KEY = "cart"; // usa el mismo nombre que escuchas en 'storage'

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(arr) ? arr.map(i => ({ ...i, qty: i.qty ?? 1 })) : [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export const CART_STORAGE_KEY = KEY;
