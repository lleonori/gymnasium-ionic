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
  IonItem,
  IonLabel,
  IonToast,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import {
  logOutOutline,
  personCircleOutline,
  trashBinOutline,
} from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router";

import { deleteProfile } from "../../../api/profile/profileApi";
import { callbackUri } from "../../../Auth.config";
import { TUser } from "../../../models/user/userModel";
import { Colors } from "../../../utils/enums";
import "./ProfileContainer.css";

const ProfileContainer = () => {
  const history = useHistory();
  const { user, logout } = useAuth0();

  // state for ActionSheet
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");

  const extendedUser = user as TUser;

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
    history.replace("/"); // Redirect to home after logout
  };

  const handleOpenActionSheet = () => {
    setIsOpen(true);
  };

  const { mutate: deleteAccountMutation } = useMutation({
    mutationFn: () => deleteProfile(user?.sub),
    onSuccess: () => {
      setIsOpen(false);
      showToastWithMessage("Profilo eliminato", Colors.SUCCESS);
      void handleLogout();
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
          <IonCardTitle>{extendedUser.name}</IonCardTitle>
          <IonCardSubtitle>
            <IonCardSubtitle>
              <IonIcon icon={personCircleOutline} />
            </IonCardSubtitle>
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>Ciao, pronto a dare il massimo oggi? </IonCardContent>
      </IonCard>
      <IonCard>
        {/* Logout */}
        <IonItem>
          <IonAvatar aria-hidden="true" slot="start">
            <img alt="Logout avatar" src="/assets/profile/logout.png" />
          </IonAvatar>
          <IonLabel>
            <h1>Tempo di pausa!</h1>
            <IonButton
              color={Colors.PRIMARY}
              shape="round"
              size="small"
              data-testid="logout-button"
              onClick={() => void handleLogout()}
            >
              <IonIcon slot="start" icon={logOutOutline}></IonIcon>
              Logout
            </IonButton>
          </IonLabel>
        </IonItem>
        {/* Elimina account */}
        <IonItem>
          <IonAvatar aria-hidden="true" slot="start">
            <img
              alt="Delete profile avatar"
              src="/assets/profile/trash-bin.png"
            />
          </IonAvatar>
          <IonLabel>
            <h1>Elimina account, sei sicuro?</h1>
            <IonButton
              color={Colors.DANGER}
              shape="round"
              size="small"
              data-testid="delete-profile-button"
              onClick={handleOpenActionSheet}
            >
              <IonIcon slot="start" icon={trashBinOutline}></IonIcon>
              Elimina
            </IonButton>
          </IonLabel>
        </IonItem>
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
