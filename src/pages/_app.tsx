// src/pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/global.css";
import { CartProvider } from "../context/CartContext"; // 👈 importa el provider

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
