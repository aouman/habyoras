import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": "http://127.0.0.1:8000",
      "/storage": "http://127.0.0.1:8000",
    },
  },
  base: mode === 'production' ? '/dist/' : '/',
  build: {
    outDir: "backend/public/dist",
    emptyOutDir: true,
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
