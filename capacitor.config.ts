import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "gymnasium.ionic",
  appName: "gymnasium-ionic",
  webDir: "dist",
  server: {
    androidScheme: "http",
    iosScheme: "http",
  },
};

export default config;
