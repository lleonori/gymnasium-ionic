import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { domain as auth0Domain, clientId, callbackUri } from "./Auth.config";
import Login from "./pages/Login";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={auth0Domain}
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
