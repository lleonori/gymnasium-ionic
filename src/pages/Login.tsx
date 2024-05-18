import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import LoginButton from "../components/LoginButton";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gymnasium</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Gymnasium</IonTitle>
          </IonToolbar>
        </IonHeader>
        <LoginButton />
      </IonContent>
    </IonPage>
  );
};

export default Home;
