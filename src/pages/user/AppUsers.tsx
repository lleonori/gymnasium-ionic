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
import Coach from "./Coach";

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
          <Redirect exact path="/" to="/coaches" />
          <Route path="/coaches" component={Coach} />
          <Route path="/booking" component={Booking} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="coaches" href="/coaches" data-testid="tab-coaches">
            <IonIcon icon={barbellOutline} />
            <IonLabel>Coaches</IonLabel>
          </IonTabButton>
          <IonTabButton tab="booking" href="/booking" data-testid="tab-booking">
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
    </IonReactRouter>
  );
};

export default AppUsers;
