/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mediumpurple-dotterel-725437.hostingersite.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  async redirects() {
    return [
      // ✅ Consolidar SEO: que /bienvenido apunte a la raíz
      { source: "/bienvenido", destination: "/", permanent: true },

      // ✅ Alias/normalizaciones que ya tenías
      { source: "/quienes-somos", destination: "/quienes_somos", permanent: true },
      { source: "/competencias/", destination: "/competencias", permanent: true },
    ];
  },
};

module.exports = nextConfig;
