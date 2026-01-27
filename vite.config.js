import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          process.env.NODE_ENV === "development" && [
            "@locator/babel-jsx/dist",
            {
              env: "development",
              rootDir: path.resolve(__dirname).replace(/\\/g, "/"),
            },
          ],
        ].filter(Boolean),
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    historyApiFallback: true,
  },
});
