import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './ManageBooking.css';

const ManageBooking: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gestisci</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Gestisci</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Gestisci" />
      </IonContent>
    </IonPage>
  );
};

export default ManageBooking;
