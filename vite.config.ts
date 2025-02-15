import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import * as fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy()],
  server: {
    https: {
      key: fs.readFileSync("./ssl/localhost.key"),
      cert: fs.readFileSync("./ssl/localhost.crt"),
    },
  },
});
