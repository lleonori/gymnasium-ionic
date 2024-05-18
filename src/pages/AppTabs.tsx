import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { calendar, home } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Booking from "./Booking";
import "./AppTabs.css";
import Home from "./Home";

const AppTabs: React.FC = () => {
  return (
    <IonPage>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/home">
              <Home />
            </Route>
            <Route exact path="/booking">
              <Booking />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon aria-hidden="true" icon={home} />
              <IonLabel>home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="booking" href="/booking">
              <IonIcon aria-hidden="true" icon={calendar} />
              <IonLabel>Prenotati</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonPage>
  );
};

export default AppTabs;
