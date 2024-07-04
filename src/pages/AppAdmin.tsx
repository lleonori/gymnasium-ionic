import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import { IonContent, IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { logOut } from "ionicons/icons";
import { callbackUri } from "../auth.config";
import Spinner from "../components/Spinner";
import BookingList from "./BookingList";

const AppAdmin: React.FC = () => {
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
    <IonContent className="ion-padding">
      <IonFab horizontal="end">
        <IonFabButton onClick={handleLogout}>
          <IonIcon icon={logOut}></IonIcon>
        </IonFabButton>
      </IonFab>
      <BookingList />
    </IonContent>
  );
};

export default AppAdmin;
