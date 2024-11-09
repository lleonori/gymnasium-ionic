import { isPlatform } from "@ionic/react";

export const domain = "dev-cjdd0dct4ytaucqh.eu.auth0.com";
export const clientId = "Fq6el0lCqOPkWLXdh7a3v1zrerywxoEK";

const appId = "gymnasium.ionic";
const auth0Domain = domain;
const iosOrAndroid = isPlatform("hybrid");
console.log("Here!", iosOrAndroid);

export const callbackUri = iosOrAndroid
  ? `${appId}://${auth0Domain}/capacitor/${appId}`
  : "http://localhost:8100";
