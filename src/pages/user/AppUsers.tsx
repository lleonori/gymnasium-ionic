import { useAuth0 } from "@auth0/auth0-react";
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
  personCircleOutline,
} from "ionicons/icons";
import { Redirect, Route, useLocation } from "react-router";
import Spinner from "../../components/common/Spinner/Spinner";
import Profile from "../common/Profile";
import Booking from "./Booking";
import Coach from "./Coach";

const AppUsers = () => {
  const { isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) return <Spinner />;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/coaches" />
        <Route exact={true} path="/coaches" render={() => <Coach />} />
        <Route exact={true} path="/booking" render={() => <Booking />} />
        <Route exact={true} path="/profile" render={() => <Profile />} />
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
        <IonTabButton tab="profile" href="/profile" data-testid="tab-profile">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profilo</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppUsers;
