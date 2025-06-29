import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import CoachContainer from "../../components/containers/CoachContainer/CoachContainer";

const Coach = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Coaches</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Coaches</IonTitle>
          </IonToolbar>
        </IonHeader>
        <CoachContainer />
      </IonContent>
    </IonPage>
  );
};

export default Coach;
