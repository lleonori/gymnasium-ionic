import {
  IonActionSheet,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOutline, trashBinOutline } from "ionicons/icons";
import { useMemo, useState } from "react";
import {
  deleteCoach,
  getCoachs,
  updateCoach,
} from "../../../api/coach/coachApi";
import { TCoach } from "../../../models/coach/coachModel";
import { TModalRole } from "../../../models/modal/modalModel";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import { Colors } from "../../../utils/enums";
import Error from "../../common/Error";
import Spinner from "../../common/Spinner/Spinner";
import HandlerCoach from "./modal/HandlerCoach";
import { getRandomImage } from "../../../utils/functions";

const CoachContainer = () => {
  const queryClient = useQueryClient();

  // state for ActionSheet
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const handleOpenActionSheet = () => {
    setIsOpen(true);
  };

  const { mutate: deleteCoachMutate } = useMutation({
    mutationFn: () => deleteCoach(currentCoach!.id),
    onSuccess: () => {
      // Invalidate and refetch coachs
      queryClient.invalidateQueries({ queryKey: ["coachs"] });
      showToastWithMessage("Coach eliminato", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      setCurrentCoach(null);
      setIsOpen(false);
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

  const imagesMap = useMemo(() => {
    if (!coachs) return {};

    const map: { [key: string]: string } = {};
    coachs.data.forEach((coach: TCoach) => {
      map[coach.id] = getRandomImage();
    });
    return map;
  }, [coachs]);

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
                      <img alt="Coach's avatar" src={imagesMap[coach.id]} />
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
                handleOpenActionSheet();
                setCurrentCoach(coach);
              }}
            >
              <IonIcon aria-hidden="true" icon={trashBinOutline} />
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      ))}
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
              deleteCoachMutate();
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

export default CoachContainer;
