import { useAuth0 } from '@auth0/auth0-react';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { calendarNumberOutline, personCircleOutline } from 'ionicons/icons';
import { Redirect, Route } from 'react-router';

import Spinner from '../../components/common/Spinner/Spinner';
import Profile from '../common/Profile';

import SearchBooking from './SearchBooking';

const AppAdministrator = () => {
  const { isLoading } = useAuth0();

  if (isLoading) return <Spinner />;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path='/administrator' to='/administrator/search-bookings' />
        <Route path='/administrator/search-bookings' component={SearchBooking} />
        <Route exact path='/administrator/profile' render={() => <Profile />} />
      </IonRouterOutlet>

      <IonTabBar slot='bottom'>
        <IonTabButton
          tab='search-bookings'
          href='/administrator/search-bookings'
          data-testid='tab-search-bookings'
          selected={location.pathname === '/administrator/search-bookings'}
        >
          <IonIcon icon={calendarNumberOutline} />
          <IonLabel>Prenotazioni</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab='profile'
          href='/administrator/profile'
          data-testid='tab-profile'
          selected={location.pathname === '/administrator/profile'}
        >
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profilo</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppAdministrator;
