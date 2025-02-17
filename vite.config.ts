import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import * as fs from "fs";

const isProduction = process.env.NODE_ENV === "production";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy()],
  server: {
    https: isProduction
      ? {
          key: fs.readFileSync("./ssl/localhost.key"),
          cert: fs.readFileSync("./ssl/localhost.crt"),
        }
      : {},
  },
});
