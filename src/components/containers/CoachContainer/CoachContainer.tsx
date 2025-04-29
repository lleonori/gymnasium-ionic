import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonToast,
  useIonModal,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { createOutline, trashBinOutline } from "ionicons/icons";
import { useState } from "react";
import { TCoach, TCreateCoach } from "../../../models/coach/coachModel";
import { TModalRole } from "../../../models/modal/modalModel";
import { Colors } from "../../../utils/enums";
import HandlerCoach from "./modal/HandlerCoach";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  deleteCoach,
  getCoachs,
  saveCoach,
  updateCoach,
} from "../../../api/coach/coachApi";
import Spinner from "../../common/Spinner/Spinner";
import Error from "../../common/Error";
import { TResponseError } from "../../../models/problems/responseErrorModel";

const CoachContainer = () => {
  const queryClient = useQueryClient();

  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");
  // state for current coach
  const [currentCoach, setCurrentCoach] = useState<TCoach | null>(null);

  const {
    data: coachs,
    isLoading: isCoachsLoading,
    error: coachsError,
  } = useQuery({
    queryFn: () => getCoachs(),
    queryKey: ["coachs"],
  });

  const [present, dismissModal] = useIonModal(HandlerCoach, {
    dismiss: (data: TCoach | null, role: TModalRole) =>
      dismissModal(data, role),
    currentCoach: currentCoach,
    mode: "update",
  });

  const openModal = () => {
    present({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
        console.log("event.detail.data", event.detail.data);
        if ((event.detail.role as TModalRole) === "confirm") {
          if (event.detail.data as TCoach) updateCoachMutate(event.detail.data);
        }
      },
    });
  };

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

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

  if (isCoachsLoading) {
    return <Spinner />;
  }

  if (coachsError) {
    return <Error />;
  }

  return (
    <>
      {coachs?.data.map((coach: TCoach) => (
        <IonItemSliding key={coach.id}>
          <IonItemOptions side="start">
            <IonItemOption
              color={Colors.WARNING}
              onClick={() => {
                setCurrentCoach(coach);
                openModal();
              }}
            >
              <IonIcon aria-hidden="true" icon={createOutline} />
            </IonItemOption>
          </IonItemOptions>
          <IonItem>
            <IonLabel>
              {/* Coach Card */}
              <IonCard key={coach.id}>
                <IonCardHeader>
                  <IonCardTitle>
                    Coach <br />
                    {coach.name} {coach.surname}
                  </IonCardTitle>
                  <IonCardSubtitle>
                    <IonAvatar>
                      <img alt="Coach's avatar" src={coach.image} />
                    </IonAvatar>
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  {coach?.notes
                    .split(",")
                    .map((note: string, index: number) => (
                      <IonChip key={index}>
                        <IonLabel>{note}</IonLabel>
                      </IonChip>
                    ))}
                </IonCardContent>
              </IonCard>
            </IonLabel>
          </IonItem>
          <IonItemOptions side="end">
            <IonItemOption
              color={Colors.DANGER}
              onClick={() => {
                deleteCoachMutate(coach.id);
              }}
            >
              <IonIcon aria-hidden="true" icon={trashBinOutline} />
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      ))}
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

export default CoachContainer;
