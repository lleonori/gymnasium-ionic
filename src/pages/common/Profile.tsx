import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import ProfileContainer from "../../components/containers/common/ProfileContainer";

const Profile = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profilo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profilo</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ProfileContainer />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
