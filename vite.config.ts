import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

import { version } from "./package.json";

const API_ORIGIN = process.env.VITE_API_ORIGIN ?? "https://edh-api.devine.dev";

export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 800 },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(version),
  },
  server: {
    proxy: {
      "^/(users|decks|formats|matches).*": {
        target: API_ORIGIN,
        changeOrigin: true,
        rewrite: (path) => `/v1-dev${path}`,
      },
    },
  },
});
