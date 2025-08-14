import { useAuth0 } from '@auth0/auth0-react';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { barbellOutline, briefcaseOutline, personCircleOutline, timeOutline } from 'ionicons/icons';
import { Redirect, Route, useLocation } from 'react-router';

import Spinner from '../../components/common/Spinner/Spinner';
import Profile from '../common/Profile';
import AssignTimetable from './AssignTimetable';
import Coach from './Coach';
import Timetable from './Timetable';

const AppSystemAdministrator = () => {
  const { isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) return <Spinner />;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path='/systemAdministrator' to='/systemAdministrator/coaches' />
        <Route path='/systemAdministrator/coaches' component={Coach} />
        <Route path='/systemAdministrator/timetables' component={Timetable} />
        <Route path='/systemAdministrator/assign-timetables' component={AssignTimetable} />
        <Route exact path='/systemAdministrator/profile' component={Profile} />
      </IonRouterOutlet>

      <IonTabBar slot='bottom'>
        <IonTabButton
          tab='coaches'
          href='/systemAdministrator/coaches'
          data-testid='tab-coaches'
          selected={location.pathname === '/systemAdministrator/coaches'}
        >
          <IonIcon icon={barbellOutline} />
          <IonLabel>Coaches</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab='timetables'
          href='/systemAdministrator/timetables'
          data-testid='tab-timetables'
          selected={location.pathname === '/systemAdministrator/timetables'}
        >
          <IonIcon icon={timeOutline} />
          <IonLabel>Orari</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab='assign-timetables'
          href='/systemAdministrator/assign-timetables'
          data-testid='tab-assign-timetables'
          selected={location.pathname === '/systemAdministrator/assign-timetables'}
        >
          <IonIcon icon={briefcaseOutline} />
          <IonLabel>Assegna Orari</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab='profile'
          href='/systemAdministrator/profile'
          data-testid='tab-profile'
          selected={location.pathname === '/systemAdministrator/profile'}
        >
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profilo</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppSystemAdministrator;
