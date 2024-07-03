import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Booking.css";
import BookingListContainer from "../components/BookingListContainer";

const BookingList: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista Prenotazioni</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Lista Prenotazioni</IonTitle>
          </IonToolbar>
        </IonHeader>
        <BookingListContainer />
      </IonContent>
    </IonPage>
  );
};

export default BookingList;
