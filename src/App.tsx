import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Theme variables */
import { useAuth0 } from "@auth0/auth0-react";
import { App as CapApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { useEffect } from "react";
import { callbackUri } from "./auth.config";
import AppAdmin from "./pages/AppAdmin";
import AppUsers from "./pages/AppUsers";
import Login from "./pages/Login";
import "./theme/variables.css";
import { Roles } from "./utils/enums";
import { useAuthInterceptor } from "./hooks/useAuthInterceptor";

setupIonicReact({
  mode: "ios",
});

const App = () => {
  useAuthInterceptor();

  const { isAuthenticated, user, handleRedirectCallback } = useAuth0();

  useEffect(() => {
    CapApp.addListener("appUrlOpen", async ({ url }) => {
      if (url.startsWith(callbackUri)) {
        if (
          url.includes("state") &&
          (url.includes("code") || url.includes("error"))
        ) {
          await handleRedirectCallback(url);
        }

        await Browser.close();
      }
    });
  }, [handleRedirectCallback]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            path="/"
            render={() => {
              return isAuthenticated ? (
                // user_status is a custom property
                user && user["user_status"].role === Roles.ADMINISTRATOR ? (
                  <AppAdmin />
                ) : (
                  <AppUsers />
                )
              ) : (
                <Login />
              );
            }}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
