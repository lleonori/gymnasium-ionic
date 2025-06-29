import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import TimetableContainer from "../../components/containers/TimetableContainer/TimetableContainer";

const Timetable = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Orari</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Orari</IonTitle>
          </IonToolbar>
        </IonHeader>
        <TimetableContainer />
      </IonContent>
    </IonPage>
  );
};

export default Timetable;
