import { useAuth0 } from "@auth0/auth0-react";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { barbellOutline, calendarNumberOutline } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Spinner from "../components/Spinner";
import Booking from "./Booking";
import Home from "./Home";

const AppUsers = () => {
  const { isLoading } = useAuth0();

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
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default AppUsers;
