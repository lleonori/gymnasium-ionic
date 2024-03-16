import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Booking.css';
import BookingContainer from '../components/BookingContainer';

const Booking: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Prenotati</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Prenotati</IonTitle>
          </IonToolbar>
        </IonHeader>
        <BookingContainer name="Prenotati" />
      </IonContent>
    </IonPage>
  );
};

export default Booking;
