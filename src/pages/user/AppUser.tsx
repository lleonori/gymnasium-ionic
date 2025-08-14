import { useAuth0 } from '@auth0/auth0-react';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { barbellOutline, calendarNumberOutline, personCircleOutline } from 'ionicons/icons';
import { Redirect, Route, useLocation } from 'react-router';

import Spinner from '../../components/common/Spinner/Spinner';
import Profile from '../common/Profile';

import Booking from './Booking';
import Coach from './Coach';

const AppUser = () => {
  const { isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) return <Spinner />;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path='/user' to='/user/coaches' />
        <Route exact path='/user/coaches' render={() => <Coach />} />
        <Route exact path='/user/booking' render={() => <Booking />} />
        <Route exact path='/user/profile' render={() => <Profile />} />
      </IonRouterOutlet>

      <IonTabBar slot='bottom'>
        <IonTabButton
          tab='coaches'
          href='/user/coaches'
          data-testid='tab-coaches'
          selected={location.pathname === '/user/coaches'}
        >
          <IonIcon icon={barbellOutline} />
          <IonLabel>Coaches</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab='booking'
          href='/user/booking'
          data-testid='tab-booking'
          selected={location.pathname === '/user/booking'}
        >
          <IonIcon icon={calendarNumberOutline} />
          <IonLabel>Prenotazioni</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab='profile'
          href='/user/profile'
          data-testid='tab-profile'
          selected={location.pathname === '/user/profile'}
        >
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profilo</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppUser;
