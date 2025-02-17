import { CapacitorConfig } from "@capacitor/cli";

const isProduction = process.env.NODE_ENV === "production";

const config: CapacitorConfig = {
  appId: "gymnasium.ionic",
  appName: "gymnasium-ionic",
  webDir: "dist",
  server: isProduction
    ? {
        androidScheme: "https",
        iosScheme: "https",
      }
    : { androidScheme: "http", iosScheme: "http" },
};

export default config;
