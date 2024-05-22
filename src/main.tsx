import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { domain, callbackUri, clientId } from "./auth.config";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: callbackUri,
      }}
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
