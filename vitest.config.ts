import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}", "**/?(*.)test.{ts,tsx}"],
    // Force Vite to transform react-tweet (and its CSS modules)
    // instead of Node.js trying to load .module.css as native ESM.
    server: {
      deps: {
        inline: ["react-tweet"],
      },
    },
    // Handle CSS modules from dependencies
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
