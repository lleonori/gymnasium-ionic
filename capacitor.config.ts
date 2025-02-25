import { CapacitorConfig } from "@capacitor/cli";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const config: CapacitorConfig = {
  appId: "gymnasium.ionic",
  appName: "gymnasium-ionic",
  webDir: "dist",
  server: {
    url: process.env.VITE_API_URL,
    cleartext: !isProduction,
  },
};

export default config;
