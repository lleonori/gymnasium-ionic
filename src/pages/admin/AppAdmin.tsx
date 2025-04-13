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
import { callbackUri } from "../../Auth.config";
import AppAdminContainer from "../../components/containers/AdminBookingsContainer";
import Spinner from "../../components/common/Spinner/Spinner";
import { Colors } from "../../utils/enums";

const AppAdmin = () => {
  const { logout, isLoading } = useAuth0();

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

  if (isLoading) return <Spinner />;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Prenotazioni</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonFab slot="fixed" vertical="top" horizontal="end" edge={true}>
          <IonFabButton>
            <IonIcon icon={chevronDownCircleOutline}></IonIcon>
          </IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Prenotazioni</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AppAdminContainer />
      </IonContent>
    </IonPage>
  );
};

export default AppAdmin;
