import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import CoachContainer from "../../components/containers/CoachContainer";

const Coachs = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Coach</IonTitle>
          <IonButtons collapse={true} slot="end">
            <IonButton>Aggiungi</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar class="ion-justify-content-center">
            <IonTitle size="large">Coach</IonTitle>
            <IonIcon size="large" slot="end" icon={addCircleOutline}></IonIcon>
          </IonToolbar>
        </IonHeader>
        <CoachContainer />
      </IonContent>
    </IonPage>
  );
};

export default Coachs;
