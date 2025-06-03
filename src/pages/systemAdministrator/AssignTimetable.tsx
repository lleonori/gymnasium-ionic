import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import AssignTimetableContainer from "../../components/containers/AssignTimetableContainer/AssignTimetableContainer";

const AssignTimetable = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Assegna Orari</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Assegna Orari</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AssignTimetableContainer />
      </IonContent>
    </IonPage>
  );
};

export default AssignTimetable;
