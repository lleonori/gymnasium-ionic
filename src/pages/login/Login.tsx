import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import { IonButton, IonContent, IonImg, IonPage } from "@ionic/react";
import "./Login.css";
import { Colors } from "../../utils/enums";

const Login = () => {
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
      <IonContent className="ion-padding" fullscreen>
        <div className="container">
          <IonImg src="/assets/Gymnasium_completo.svg"></IonImg>
          <IonButton color={Colors.WARNING} shape="round" onClick={login}>
            Accedi
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
