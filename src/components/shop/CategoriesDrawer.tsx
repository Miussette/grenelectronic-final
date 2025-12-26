import { useEffect } from "react";
import Link from "next/link";

function CategoriesDrawer({
  open,
  onClose,
  categories,
  current,
}: {
  open: boolean;
  onClose: () => void;
  categories: string[];
  current?: string;
}) {
  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } z-40`}
      />
      {/* drawer */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white text-neutral-900 shadow-xl z-50 
                    transform transition-transform duration-200 ${
                      open ? "translate-x-0" : "-translate-x-full"
                    }`}
        aria-hidden={!open}
        aria-label="Categorías"
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-neutral-200">
          <h3 className="text-base font-semibold uppercase tracking-wide">Categorías</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-neutral-100"
            aria-label="Cerrar categorías"
          >
            ✕
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/tienda"
                className={`block px-3 py-2 rounded-md hover:bg-neutral-100 ${
                  !current ? "font-semibold text-emerald-700" : ""
                }`}
                onClick={onClose}
              >
                Todas las categorías
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/tienda?category=${encodeURIComponent(c)}`}
                  className={`block px-3 py-2 rounded-md hover:bg-neutral-100 ${
                    current === c ? "font-semibold text-emerald-700" : ""
                  }`}
                  onClick={onClose}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
