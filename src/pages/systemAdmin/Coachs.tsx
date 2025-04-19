import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { barbellOutline } from "ionicons/icons";
import { useState } from "react";
import {
  deleteCoach,
  getCoachs,
  saveCoach,
  updateCoach,
} from "../../api/coach/coachApi";
import CoachContainer from "../../components/containers/CoachContainer/CoachContainer";
import HandlerCoach from "../../components/containers/CoachContainer/modal/HandlerCoach";
import { TCoach, TCreateCoach } from "../../models/coach/coachModel";
import { TModalRole } from "../../models/modal/modalModel";
import { TResponseError } from "../../models/problems/responseErrorModel";
import { Colors } from "../../utils/enums";

const Coachs = () => {
  const queryClient = useQueryClient();

  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");

  const {
    data: coachs,
    isLoading: isCoachsLoading,
    error: coachsError,
  } = useQuery({
    queryFn: () => getCoachs(),
    queryKey: ["coachs"],
  });

  const { mutate: saveCoachMutate } = useMutation({
    mutationFn: (newCoach: TCreateCoach) => saveCoach(newCoach),
    onSuccess: () => {
      // Invalidate and refetch coachs
      queryClient.invalidateQueries({ queryKey: ["coachs"] });
      showToastWithMessage("Coach inserito", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const { mutate: updateCoachMutate } = useMutation({
    mutationFn: (currentCoach: TCoach) => updateCoach(currentCoach),
    onSuccess: () => {
      // Invalidate and refetch coachs
      queryClient.invalidateQueries({ queryKey: ["coachs"] });
      showToastWithMessage("Coach aggiornato", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const { mutate: deleteCoachMutate } = useMutation({
    mutationFn: (id: number) => deleteCoach(id),
    onSuccess: () => {
      // Invalidate and refetch coachs
      queryClient.invalidateQueries({ queryKey: ["coachs"] });
      showToastWithMessage("Coach eliminato", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

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

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Coach</IonTitle>
          <IonButtons collapse={true} slot="end">
            <IonButton onClick={() => openModal()}>Aggiungi</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar class="ion-justify-content-center">
            <IonTitle size="large">Coach</IonTitle>
            <IonChip color={Colors.PRIMARY} onClick={() => openModal()}>
              Aggiungi Coach<IonIcon icon={barbellOutline}></IonIcon>
            </IonChip>
            {/* <IonIcon
              size="large"
              slot="end"
              icon={addCircleOutline}
              onClick={() => openModal()}
            ></IonIcon> */}
          </IonToolbar>
        </IonHeader>
        <CoachContainer
          coachs={coachs?.data}
          isCoachsLoading={isCoachsLoading}
          coachsError={coachsError}
          handleUpdate={updateCoachMutate}
          handleDelete={deleteCoachMutate}
        />
      </IonContent>
      {/* Toasts */}
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        color={toastColor}
        duration={2000}
        onDidDismiss={() => setShowToast(false)}
      />
    </IonPage>
  );
};

export default Coachs;
