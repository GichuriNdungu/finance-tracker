import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Finance Tracker - MoMo",
        short_name: "Finance Tracker",
        description: "Track your mobile money spending with detailed insights.",
        theme_color: "#E8913A",
        background_color: "#0F172A",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 50 }
            }
          }
        ]
      },
      registerType: "autoUpdate",
      devOptions: {
        enabled: false
      }
    })
  ]
});
