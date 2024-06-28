import {
  IonButton,
  IonContent,
  IonImg,
  IonPage,
  useIonRouter,
} from "@ionic/react";
import "./Login.css";
import { Browser } from "@capacitor/browser";
import { useAuth0 } from "@auth0/auth0-react";

const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const router = useIonRouter();
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

  // const login = () => {
  //   router.push("/tab");
  // };

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

export default Login;
