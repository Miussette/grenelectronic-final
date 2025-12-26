// src/context/CartContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;       // en CLP
  qty: number;
  image_url?: string | null;
  sku?: string | null;
};

type CartCtx = {
  items: CartItem[];
  count: number;                  // suma de cantidades
  total: number;                  // suma price*qty
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const LS_KEY = "cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar desde localStorage (solo en cliente)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // Persistir cambios
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const api = useMemo<CartCtx>(() => {
    const add: CartCtx["add"] = (p, qty = 1) => {
      setItems((prev) => {
        const i = prev.findIndex((x) => x.id === p.id);
        if (i >= 0) {
          const next = [...prev];
          next[i] = { ...next[i], qty: next[i].qty + qty };
          return next;
        }
        return [...prev, { ...p, qty }];
      });
    };
    const inc = (id: string) =>
      setItems((prev) =>
        prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
      );
    const dec = (id: string) =>
      setItems((prev) =>
        prev
          .map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))
          .filter((x) => x.qty > 0)
      );
    const remove = (id: string) =>
      setItems((prev) => prev.filter((x) => x.id !== id));
    const clear = () => setItems([]);

    const count = items.reduce((s, it) => s + it.qty, 0);
    const total = items.reduce((s, it) => s + it.qty * Number(it.price || 0), 0);

    return { items, count, total, add, inc, dec, remove, clear };
  }, [items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
