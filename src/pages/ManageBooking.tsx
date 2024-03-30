import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './ManageBooking.css';
import ManageBookingContainer from '../components/ManageBookingContainer';

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
        <ManageBookingContainer name="Gestisci" />
      </IonContent>
    </IonPage>
  );
};

export default ManageBooking;
