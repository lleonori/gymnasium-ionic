import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { calendar, home } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import "./AppTabs.css";
import Booking from "./Booking";
import Home from "./Home";

const AppTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tab/home" component={Home} />
        <Route path="/tab/booking" component={Booking} />
        <Route exact path="/tab">
          <Redirect to="/tab/home" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tab/home">
          <IonIcon aria-hidden="true" icon={home} />
          <IonLabel>home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="booking" href="/tab/booking">
          <IonIcon aria-hidden="true" icon={calendar} />
          <IonLabel>Prenotati</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppTabs;
