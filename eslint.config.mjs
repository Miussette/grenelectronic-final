import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Presets de Next + TS
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Overrides y settings
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json", // asegúrate que existe en la raíz
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // reglas útiles para evitar errores de compilación en cambios rápidos
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      // si quieres desactivar temporalmente
      // "import/no-unresolved": "off",
    },
  },
];
