import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import SearchBookingContainer from "../../components/containers/SearchBookingContainer/SearchBookingContainer";

const SearchBooking = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Prenotazioni</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar class="ion-justify-content-center">
            <IonTitle size="large">Prenotazioni</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SearchBookingContainer />
      </IonContent>
    </IonPage>
  );
};

export default SearchBooking;
