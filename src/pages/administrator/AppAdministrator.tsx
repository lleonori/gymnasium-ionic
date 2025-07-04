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
import { calendarNumberOutline, logOutOutline } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import { callbackUri } from "../../Auth.config";
import Spinner from "../../components/common/Spinner/Spinner";
import SearchBooking from "./SearchBooking";

const AppAdministrator = () => {
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
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/search-bookings" />
        <Route path="/search-bookings" component={SearchBooking} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton
          tab="search-bookings"
          href="/search-bookings"
          data-testid="tab-search-bookings"
          selected={location.pathname === "/search-bookings"}
        >
          <IonIcon icon={calendarNumberOutline} />
          <IonLabel>Prenotazioni</IonLabel>
        </IonTabButton>
        <IonTabButton tab="logout" onClick={handleLogout}>
          <IonIcon icon={logOutOutline} />
          <IonLabel>Logout</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppAdministrator;
