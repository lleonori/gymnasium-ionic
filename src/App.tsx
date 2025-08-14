import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

import { useAuth0 } from '@auth0/auth0-react';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { useEffect } from 'react';
import { Route } from 'react-router-dom';

import { callbackUri } from './Auth.config';
import Spinner from './components/common/Spinner/Spinner';
import { useAuthInterceptor } from './hooks/useAuthInterceptor';
import AppAdministrator from './pages/administrator/AppAdministrator';
import SelectRole from './pages/common/SelectRole';
import Login from './pages/login/Login';
import AppSystemAdministrator from './pages/systemAdministrator/AppSystemAdministrator';
import AppUser from './pages/user/AppUser';
import './theme/variables.css';

setupIonicReact();

const App = () => {
  useAuthInterceptor();

  const { isAuthenticated, handleRedirectCallback, isLoading } = useAuth0();

  useEffect(() => {
    CapApp.addListener('appUrlOpen', async ({ url }) => {
      if (url.startsWith(callbackUri)) {
        if (url.includes('state') && (url.includes('code') || url.includes('error'))) {
          await handleRedirectCallback(url);
        }

        await Browser.close();
      }
    });
  }, [handleRedirectCallback]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path='/' component={SelectRole} />
          <Route path='/systemAdministrator' component={AppSystemAdministrator} />
          <Route path='/administrator' component={AppAdministrator} />
          <Route path='/user' component={AppUser} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
