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

import { useAuth0 } from "@auth0/auth0-react";
import { App as CapApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { useEffect } from "react";
import { callbackUri } from "./Auth.config";
import { useAuthInterceptor } from "./hooks/useAuthInterceptor";
import { TUser } from "./models/user/userModel";
import AppAdmin from "./pages/admin/AppAdmin";
import Login from "./pages/login/Login";
import AppSystemAdmin from "./pages/systemAdmin/AppSystemAdmin";
import AppUsers from "./pages/user/AppUsers";
import "./theme/variables.css";
import { UserRoles } from "./utils/enums";
import Spinner from "./components/common/Spinner/Spinner";

setupIonicReact({
  mode: "ios",
});

const App = () => {
  useAuthInterceptor();

  const { isAuthenticated, user, handleRedirectCallback, isLoading } =
    useAuth0();
  const extendedUser = user as TUser;

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

  if (isLoading || (isAuthenticated && !extendedUser)) {
    return <Spinner />;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            path="/"
            render={() => {
              if (!isAuthenticated) return <Login />;

              const roles = extendedUser?.app_metadata?.roles || [];

              const isSystemAdmin = roles.includes(
                UserRoles.SYSTEM_ADMINISTRATOR
              );
              const isAdmin = roles.includes(UserRoles.ADMINISTRATOR);

              if (isSystemAdmin) return <AppSystemAdmin />;

              if (isAdmin) return <AppAdmin />;

              return <AppUsers />;
            }}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
