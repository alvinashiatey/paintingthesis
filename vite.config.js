import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [legacy()],
  build: {
    outDir: "_site",
    sourceMap: true,
    manifest: true,
    rollupOptions: {
      input: "/src/client/main.js",
    },
  },
});
