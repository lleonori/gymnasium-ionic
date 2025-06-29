import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import CoachDetailsContainer from "../../components/containers/CoachContainer/CoachDetailsContainer";

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
        <CoachDetailsContainer />
      </IonContent>
    </IonPage>
  );
};

export default Coach;
