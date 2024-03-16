import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendar, home, informationCircle, pencil, pencilSharp } from 'ionicons/icons';
import Tab2 from './pages/Booking';
import Tab3 from './pages/ManageBooking';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Home from './pages/Home';
import Booking from './pages/Booking';
import ManageBooking from './pages/ManageBooking';
import Info from './pages/Info';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/booking">
            <Booking />
          </Route>
          <Route path="/manage-booking">
            <ManageBooking />
          </Route>
          <Route path="/Info">
            <Info />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon aria-hidden="true" icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="booking" href="/booking">
            <IonIcon aria-hidden="true" icon={calendar} />
            <IonLabel>Prenotati</IonLabel>
          </IonTabButton>
          <IonTabButton tab="manage-booking" href="/manage-booking">
            <IonIcon aria-hidden="true" icon={pencilSharp} />
            <IonLabel>Gestisci</IonLabel>
          </IonTabButton>
          <IonTabButton tab="info" href="/info">
            <IonIcon aria-hidden="true" icon={informationCircle} />
            <IonLabel>Info</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
