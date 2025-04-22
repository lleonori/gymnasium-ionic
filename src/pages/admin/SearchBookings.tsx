import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import SearchBookingsContainer from "../../components/containers/SearchBookingsContainer/SearchBookingsContainer";

const AppAdmin = () => {
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
        <SearchBookingsContainer />
      </IonContent>
    </IonPage>
  );
};

export default AppAdmin;
