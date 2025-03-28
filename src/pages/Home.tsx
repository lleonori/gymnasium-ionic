import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronDownCircleOutline, logOutOutline } from "ionicons/icons";
import { callbackUri } from "../auth.config";
import HomeContainer from "../components/HomeContainer";

const Home = () => {
  const { logout } = useAuth0();

  const handleLogout = async () => {
    await logout({
      async openUrl(url) {
        await Browser.open({
          url,
          windowName: "_self",
        });
      },
      logoutParams: {
        returnTo: callbackUri,
      },
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonFab slot="fixed" vertical="top" horizontal="end" edge={true}>
          <IonFabButton>
            <IonIcon icon={chevronDownCircleOutline}></IonIcon>
          </IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton onClick={handleLogout} color="primary">
              <IonIcon icon={logOutOutline}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <HomeContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
