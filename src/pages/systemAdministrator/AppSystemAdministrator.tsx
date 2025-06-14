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
  briefcaseOutline,
  homeOutline,
  logOutOutline,
  timeOutline,
} from "ionicons/icons";
import { Redirect, Route } from "react-router";
import { callbackUri } from "../../Auth.config";
import Spinner from "../../components/common/Spinner/Spinner";
import AssignTimetable from "./AssignTimetable";
import Coach from "./Coach";
import Timetable from "./Timetable";
import HomeSystemAdministrator from "./HomeSystemAdministrator";

const AppSystemAdministrator = () => {
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
          <Redirect exact path="/" to="/home" />
          <Route path="/home" component={HomeSystemAdministrator} />
          <Route path="/coaches" component={Coach} />
          <Route path="/timetables" component={Timetable} />
          <Route path="/assign-timetables" component={AssignTimetable} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="Home" href="/home" data-testid="tab-home">
            <IonIcon icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="coaches" href="/coaches" data-testid="tab-coaches">
            <IonIcon icon={barbellOutline} />
            <IonLabel>Coaches</IonLabel>
          </IonTabButton>
          <IonTabButton
            tab="timetables"
            href="/timetables"
            data-testid="tab-timetables"
          >
            <IonIcon icon={timeOutline} />
            <IonLabel>Orari</IonLabel>
          </IonTabButton>
          <IonTabButton
            tab="assign-timetables"
            href="/assign-timetables"
            data-testid="tab-assign-timetables"
          >
            <IonIcon icon={briefcaseOutline} />
            <IonLabel>Assegna Orari</IonLabel>
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

export default AppSystemAdministrator;
