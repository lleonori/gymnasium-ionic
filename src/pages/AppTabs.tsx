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
import { IonReactRouter } from "@ionic/react-router";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "../components/Spinner";
import { Roles } from "../utils/enums";
import BookingList from "./BookingList";

const AppTabs: React.FC = () => {
  const { user, isLoading } = useAuth0();

  // If the SDK is not ready, or a user is not authenticated, exit.
  if (isLoading) return <Spinner />;

  return (
    <>
      {JSON.stringify(user)}
      {user &&
        user["https://my-app.example.com/app_metadata"].role ===
          Roles.ADMINISTRATOR && <BookingList />}
      {user &&
        user["https://my-app.example.com/app_metadata"].role === Roles.USER && (
          <IonReactRouter>
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
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="booking" href="/tab/booking">
                  <IonIcon aria-hidden="true" icon={calendar} />
                  <IonLabel>Prenotati</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        )}
    </>
  );
};

export default AppTabs;
