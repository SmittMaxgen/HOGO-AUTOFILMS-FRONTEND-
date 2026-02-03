import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react([])],
  build: {
    sourcemap: true,
  },
  server: {
    hmr: {
      overlay: false,
    },
    historyApiFallback: true,
  },
});
