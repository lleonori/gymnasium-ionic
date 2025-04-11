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
  timeOutline,
} from "ionicons/icons";
import { Redirect, Route } from "react-router";
import { callbackUri } from "../../Auth.config";
import Spinner from "../../components/common/Spinner/Spinner";
import BookingSettings from "./BookingSettings";
import Coachs from "./Coachs";
import Timetables from "./Timetables";

const AppSystemAdmin = () => {
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
          <Redirect exact path="/" to="/coachs" />
          <Route path="/coachs" component={Coachs} />
          <Route path="/timetables" component={Timetables} />
          <Route path="/bookingSettings" component={BookingSettings} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="coachs" href="/coachs">
            <IonIcon icon={barbellOutline} />
            <IonLabel>Coachs</IonLabel>
          </IonTabButton>

          <IonTabButton tab="timetables" href="/timetables">
            <IonIcon icon={timeOutline} />
            <IonLabel>Orari</IonLabel>
          </IonTabButton>

          <IonTabButton tab="bookingSettings" href="/bookingSettings">
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

export default AppSystemAdmin;
