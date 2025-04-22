import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  barbellOutline,
  calendarNumberOutline,
  logOutOutline,
} from "ionicons/icons";
import { Redirect, Route } from "react-router";
import { callbackUri } from "../../Auth.config";
import Spinner from "../../components/common/Spinner/Spinner";
import Booking from "./Booking";
import Home from "./Home";

const AppUsers = () => {
  const { isLoading, logout } = useAuth0();

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
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/home" />
          <Route path="/home" component={Home} />
          <Route path="/booking" component={Booking} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={barbellOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>

          <IonTabButton tab="booking" href="/booking">
            <IonIcon icon={calendarNumberOutline} />
            <IonLabel>Prenotazioni</IonLabel>
          </IonTabButton>
          <IonTabButton tab="logout" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} />
            <IonLabel>Logout</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default AppUsers;
