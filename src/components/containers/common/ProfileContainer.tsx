import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import {
  IonActionSheet,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonToast,
  useIonRouter,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import { personCircleOutline } from "ionicons/icons";
import { useState } from "react";

import { deleteProfile } from "../../../api/profile/profileApi";
import { callbackUri } from "../../../Auth.config";
import { TUser } from "../../../models/user/userModel";
import { Colors } from "../../../utils/enums";

const ProfileContainer = () => {
  const router = useIonRouter();
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

  const handleChangeRole = () => {
    router.push("/", "root");
  };

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
    router.push("/", "root");
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
        <IonCardContent>
          <IonText>Gestisci il tuo profilo:</IonText>
          <ul>
            {extendedUser.app_metadata.roles.length > 1 && (
              <li>
                <IonText>Puoi cambiare ruolo in qualsiasi momento</IonText>
              </li>
            )}
            <li>
              <IonText>
                Hai finito per oggi? Fai logout e ci vediamo presto!
              </IonText>
            </li>
            <li>
              <IonText>
                Se vuoi davvero lasciarci… puoi eliminare il tuo account
              </IonText>
            </li>
          </ul>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonList inset={true}>
          {/* Seleziona Ruolo */}
          {extendedUser.app_metadata.roles.length > 1 && (
            <IonItem button={true} onClick={() => void handleChangeRole()}>
              <IonAvatar aria-hidden="true" slot="start">
                <img alt="Select role avatar" src="/assets/roles/id-card.png" />
              </IonAvatar>
              <IonLabel>
                <h1>Cambia ruolo</h1>
              </IonLabel>
            </IonItem>
          )}
          {/* Logout */}
          <IonItem button={true} onClick={() => void handleLogout()}>
            <IonAvatar aria-hidden="true" slot="start">
              <img alt="Logout avatar" src="/assets/profile/logout.png" />
            </IonAvatar>
            <IonLabel>
              <h1>Logout</h1>
            </IonLabel>
          </IonItem>
          {/* Elimina account */}
          <IonItem button={true} onClick={handleOpenActionSheet}>
            <IonAvatar aria-hidden="true" slot="start">
              <img
                alt="Delete profile avatar"
                src="/assets/profile/trash-bin.png"
              />
            </IonAvatar>
            <IonLabel>
              <h1>Elimina account</h1>
            </IonLabel>
          </IonItem>
        </IonList>
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
