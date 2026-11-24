import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost:8080";

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    server: {
      host: "localhost",
      port: 5173,
      strictPort: true,

      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },

    preview: {
      port: 4173,
      strictPort: true,
    },

    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
