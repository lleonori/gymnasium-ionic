import { useAuth0 } from "@auth0/auth0-react";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { calendarNumberOutline, personCircleOutline } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Spinner from "../../components/common/Spinner/Spinner";
import SearchBooking from "./SearchBooking";
import Profile from "../common/Profile";

const AppAdministrator = () => {
  const { isLoading } = useAuth0();

  if (isLoading) return <Spinner />;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/search-bookings" />
        <Route path="/search-bookings" component={SearchBooking} />
        <Route exact={true} path="/profile" render={() => <Profile />} />
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
        <IonTabButton
          tab="profile"
          href="/profile"
          data-testid="tab-profile"
          selected={location.pathname === "/profile"}
        >
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profilo</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppAdministrator;
