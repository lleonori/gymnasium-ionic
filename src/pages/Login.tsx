import { IonButton, IonContent, IonImg, IonPage } from "@ionic/react";

import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import "./Login.css";

const Home: React.FC = () => {
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

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="container">
          <IonImg src="/assets/Gymnasium_completo.svg" alt="logo"></IonImg>
          <IonButton color={"warning"} shape="round" onClick={login}>
            Accedi
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
