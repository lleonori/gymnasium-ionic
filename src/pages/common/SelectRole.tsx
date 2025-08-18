import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import SelectRoleContainer from "../../components/containers/common/SelectRoleContainer";

const SelectRole = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ruolo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Ruolo</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SelectRoleContainer />
      </IonContent>
    </IonPage>
  );
};

export default SelectRole;
