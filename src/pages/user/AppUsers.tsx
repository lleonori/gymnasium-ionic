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
import {
  barbellOutline,
  calendarNumberOutline,
  logOutOutline,
} from "ionicons/icons";
import { Redirect, Route, useLocation } from "react-router";
import { callbackUri } from "../../Auth.config";
import Spinner from "../../components/common/Spinner/Spinner";
import Booking from "./Booking";
import Coach from "./Coach";

const AppUsers = () => {
  const { isLoading, logout } = useAuth0();
  const location = useLocation();

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
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/coaches" />
        <Route exact={true} path="/coaches" render={() => <Coach />} />
        <Route exact={true} path="/booking" render={() => <Booking />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton
          tab="coaches"
          href="/coaches"
          data-testid="tab-coaches"
          selected={location.pathname === "/coaches"}
        >
          <IonIcon icon={barbellOutline} />
          <IonLabel>Coaches</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="booking"
          href="/booking"
          data-testid="tab-booking"
          selected={location.pathname === "/booking"}
        >
          <IonIcon icon={calendarNumberOutline} />
          <IonLabel>Prenotazioni</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="logout"
          onClick={handleLogout}
          data-testid="tab-logout"
        >
          <IonIcon icon={logOutOutline} />
          <IonLabel>Logout</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppUsers;
