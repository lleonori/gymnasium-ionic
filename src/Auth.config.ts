import { isPlatform } from "@ionic/react";

export const domain = import.meta.env.VITE_DOMAIN_AUTH0;
export const clientId = import.meta.env.VITE_CLIENT_ID_AUTH0;
export const audience = import.meta.env.VITE_AUDIENCE_AUTH0;

const appId = "gymnasium.ionic";
const auth0Domain = domain;
const iosOrAndroid = isPlatform("hybrid");

export const callbackUri = iosOrAndroid
  ? `${appId}://${auth0Domain}/capacitor/${appId}`
  : "http://localhost:8100";
