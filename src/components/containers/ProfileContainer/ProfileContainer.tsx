import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import {
  IonActionSheet,
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonToast,
} from "@ionic/react";
import {
  logOutOutline,
  personCircleOutline,
  trashBinOutline,
} from "ionicons/icons";
import { callbackUri } from "../../../Auth.config";
import { TUser } from "../../../models/user/userModel";
import { Colors } from "../../../utils/enums";
import { getRandomImage } from "../../../utils/functions";
import "./ProfileContainer.css";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { deleteProfile } from "../../../api/profile/profileApi";

const ProfileContainer = () => {
  const { user, logout } = useAuth0();
  const extendedUser = user as TUser;
  // state for ActionSheet
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");

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

  const handleOpenActionSheet = () => {
    setIsOpen(true);
  };

  const { mutate: deleteAccountMutation } = useMutation({
    mutationFn: () => deleteProfile(user?.sub),
    onSuccess: () => {
      setIsOpen(false);
      showToastWithMessage("Profilo eliminato", Colors.SUCCESS);
      setTimeout(() => {
        handleLogout();
      }, 2000);
    },
    onError: (error) => {
      setIsOpen(false);
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            {extendedUser?.name ? extendedUser?.name : extendedUser?.email}
          </IonCardTitle>
          <IonCardSubtitle>
            <IonCardSubtitle>
              <IonIcon icon={personCircleOutline} />
            </IonCardSubtitle>
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>Ciao, pronto a dare il massimo oggi? </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Logout</IonCardTitle>
          <IonCardSubtitle>
            <IonAvatar>
              <img alt="Logout's avatar" src={getRandomImage()} />
            </IonAvatar>
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Pausa meritata! Ma non restare via troppo a lungo. <br />
          <IonButton
            className="ion-margin-top"
            color={Colors.PRIMARY}
            shape="round"
            size="small"
            data-testid="logout-button"
            onClick={handleLogout}
          >
            <IonIcon slot="start" icon={logOutOutline}></IonIcon>
            Logout
          </IonButton>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Elimina Account</IonCardTitle>
          <IonCardSubtitle>
            <IonAvatar>
              <img alt="Logout's avatar" src={getRandomImage()} />
            </IonAvatar>
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Addio non è mai facile… ma se sei sicuro, procedi. <br />
          <IonButton
            color={Colors.DANGER}
            className="ion-margin-top"
            shape="round"
            size="small"
            data-testid="delete-profile-button"
            onClick={handleOpenActionSheet}
          >
            <IonIcon slot="start" icon={trashBinOutline}></IonIcon>
            Elimina Account
          </IonButton>
        </IonCardContent>
      </IonCard>
      {/* Action Sheet */}
      <IonActionSheet
        isOpen={isOpen}
        header="Azioni"
        buttons={[
          {
            text: "Elimina",
            role: "destructive",
            data: {
              action: "delete",
            },
            handler: () => {
              deleteAccountMutation();
            },
          },
          {
            text: "Annulla",
            role: "cancel",
            data: {
              action: "cancel",
            },
          },
        ]}
        onDidDismiss={() => setIsOpen(false)}
      ></IonActionSheet>
      {/* Toasts */}
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        color={toastColor}
        duration={2000}
        onDidDismiss={() => setShowToast(false)}
      />
    </>
  );
};

export default ProfileContainer;
