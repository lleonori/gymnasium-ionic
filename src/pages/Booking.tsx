import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Booking.css";

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
        <ExploreContainer name="Prenotati" />
      </IonContent>
    </IonPage>
  );
};

export default Booking;
