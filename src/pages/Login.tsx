import {
  IonButton,
  IonContent,
  IonImg,
  IonPage,
  useIonRouter,
} from "@ionic/react";
import "./Login.css";

const Home: React.FC = () => {
  const router = useIonRouter();
  // const login = async () => {
  //   await loginWithRedirect({
  //     async openUrl(url) {
  //       await Browser.open({
  //         url,
  //         windowName: "_self",
  //       });
  //     },
  //   });
  // };

  const login = () => {
    router.push("/tab");
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
