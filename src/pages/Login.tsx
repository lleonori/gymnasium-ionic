import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";

import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import "./Home.css";

const Home: React.FC = () => {
  const navigation = useIonRouter();
  const { loginWithRedirect } = useAuth0();

  const login = async () => {
    await loginWithRedirect({
      async openUrl(url) {
        await Browser.open({
          url,
          windowName: "_self",
        });
      },
    });
  };

  const doLogin = () => {
    navigation.push("/tab", "root", "replace");
  };

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
        <div className="container">
          <IonButton onClick={login}>Log in</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
