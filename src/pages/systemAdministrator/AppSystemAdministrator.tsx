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
  briefcaseOutline,
  logOutOutline,
  personCircleOutline,
  timeOutline,
} from "ionicons/icons";
import { Redirect, Route, useLocation } from "react-router";
import Spinner from "../../components/common/Spinner/Spinner";
import AssignTimetable from "./AssignTimetable";
import Coach from "./Coach";
import Timetable from "./Timetable";
import Profile from "../common/Profile";

const AppSystemAdministrator = () => {
  const { isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) return <Spinner />;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/coaches" />
        <Route path="/coaches" component={Coach} />
        <Route path="/timetables" component={Timetable} />
        <Route path="/assign-timetables" component={AssignTimetable} />
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
          tab="timetables"
          href="/timetables"
          data-testid="tab-timetables"
          selected={location.pathname === "/timetables"}
        >
          <IonIcon icon={timeOutline} />
          <IonLabel>Orari</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="assign-timetables"
          href="/assign-timetables"
          data-testid="tab-assign-timetables"
          selected={location.pathname === "/assign-timetables"}
        >
          <IonIcon icon={briefcaseOutline} />
          <IonLabel>Assegna Orari</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile" data-testid="tab-profile">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profilo</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppSystemAdministrator;
