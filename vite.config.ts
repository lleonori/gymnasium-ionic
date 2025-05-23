import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), legacy()],
  server: {
    host: process.env.VITE_API_URL,
  },
});
