import { useAuth0 } from "@auth0/auth0-react";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { calendar, home, logOut } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Spinner from "../components/Spinner";
import Booking from "./Booking";
import Home from "./Home";
import { Browser } from "@capacitor/browser";
import { callbackUri } from "../auth.config";

const AppUsers: React.FC = () => {
  const { logout, isLoading } = useAuth0();

  const handleLogout = async () => {
    await logout({
      async openUrl(url) {
        await Browser.open({
          url,
          windowName: "_self",
        });
      },
      logoutParams: {
        returnTo: callbackUri,
      },
    });
  };

  if (isLoading) return <Spinner />;

  return (
    <IonContent className="ion-padding">
      <IonFab horizontal="end">
        <IonFabButton onClick={handleLogout}>
          <IonIcon icon={logOut}></IonIcon>
        </IonFabButton>
      </IonFab>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/home" component={Home} />
            <Route path="/booking" component={Booking} />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon aria-hidden="true" icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="booking" href="/booking">
              <IonIcon aria-hidden="true" icon={calendar} />
              <IonLabel>Prenotati</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonContent>
  );
};

export default AppUsers;
