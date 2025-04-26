import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/skillcapped-api": {
        target: "https://www.skill-capped.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/skillcapped-api/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("Origin", "https://www.skill-capped.com");
            proxyReq.setHeader("Referer", "https://www.skill-capped.com/");
          });
        },
      },
    },
  },
});
