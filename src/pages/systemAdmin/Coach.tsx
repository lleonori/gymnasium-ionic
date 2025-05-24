import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { barbellOutline } from "ionicons/icons";
import CoachContainer from "../../components/containers/CoachContainer/CoachContainer";
import HandlerCoach from "../../components/containers/CoachContainer/modal/HandlerCoach";
import { TCreateCoach } from "../../models/coach/coachModel";
import { TModalRole } from "../../models/modal/modalModel";
import { Colors } from "../../utils/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveCoach } from "../../api/coach/coachApi";
import { TResponseError } from "../../models/problems/responseErrorModel";
import { useState } from "react";

const Coach = () => {
  const queryClient = useQueryClient();

  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");

  const [present, dismissModal] = useIonModal(HandlerCoach, {
    dismiss: (data: TCreateCoach | null, role: TModalRole) =>
      dismissModal(data, role),
    mode: "create",
  });

  const openModal = () => {
    present({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
        console.log("event.detail.data", event.detail.data);
        if ((event.detail.role as TModalRole) === "confirm") {
          if (event.detail.data as TCreateCoach)
            saveCoachMutate(event.detail.data);
        }
      },
    });
  };

  const { mutate: saveCoachMutate } = useMutation({
    mutationFn: (newCoach: TCreateCoach) => saveCoach(newCoach),
    onSuccess: () => {
      // Invalidate and refetch coaches
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      showToastWithMessage("Coach inserito", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Coaches</IonTitle>
          <IonButtons collapse={true} slot="end">
            <IonButton onClick={() => openModal()}>Aggiungi</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar class="ion-justify-content-center">
            <IonTitle size="large">Coaches</IonTitle>
            <IonChip color={Colors.PRIMARY} onClick={() => openModal()}>
              <IonLabel>Aggiungi Coach</IonLabel>
              <IonIcon icon={barbellOutline}></IonIcon>
            </IonChip>
          </IonToolbar>
        </IonHeader>
        <CoachContainer />
      </IonContent>
      {/* Toasts */}
      <IonToast
        role="alert"
        isOpen={showToast}
        message={toastMessage}
        color={toastColor}
        duration={2000}
        onDidDismiss={() => setShowToast(false)}
      />
    </IonPage>
  );
};

export default Coach;
