import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import BookingListContainer from "../components/BookingListContainer";

const BookingList: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Prenotazioni</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Prenotazioni</IonTitle>
          </IonToolbar>
        </IonHeader>
        <BookingListContainer />
      </IonContent>
    </IonPage>
  );
};

export default BookingList;
