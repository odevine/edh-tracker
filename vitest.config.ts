import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "vitest/config";

// load from .env.test
dotenv.config({ path: ".env.test" });

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
