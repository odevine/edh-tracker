import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
  },
  resolve: {
    alias: {
      // for TypeScript path alias import like : @/x/y/z
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
