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
  IonText,
  IonToast,
  useIonModal,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { barbellOutline, createOutline, trashBinOutline } from "ionicons/icons";
import { useMemo, useState } from "react";
import {
  deleteCoach,
  getCoaches,
  saveCoach,
  updateCoach,
} from "../../../api/coach/coachApi";
import { TCoach, TCreateCoach } from "../../../models/coach/coachModel";
import { TModalRole } from "../../../models/modal/modalModel";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import { Colors } from "../../../utils/enums";
import { getRandomImage } from "../../../utils/functions";
import FallbackError from "../..//common/FallbackError/FallbackError";
import Spinner from "../../common/Spinner/Spinner";
import HandlerCoach from "./modal/HandlerCoach";

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
    data: coaches,
    isLoading: isCoachesLoading,
    error: coachesError,
    isFetching: isCoachesFetching,
  } = useQuery({
    queryFn: () => getCoaches(),
    queryKey: ["coaches"],
  });

  const [presentCreateCoach, dismissModalCreateCoach] = useIonModal(
    HandlerCoach,
    {
      dismiss: (data: TCoach | null, role: TModalRole) =>
        dismissModalCreateCoach(data, role),
      mode: "create",
    }
  );

  const [presentUpdateCoach, dismissModalUpdateCoach] = useIonModal(
    HandlerCoach,
    {
      dismiss: (data: TCoach | null, role: TModalRole) =>
        dismissModalUpdateCoach(data, role),
      currentCoach: currentCoach,
      mode: "update",
    }
  );

  const openModalCreateCoach = () => {
    presentCreateCoach({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail<TCreateCoach>>) => {
        console.log("event.detail.data", event.detail.data);
        if ((event.detail.role as TModalRole) === "confirm") {
          if (event.detail.data) saveCoachMutate(event.detail.data);
        }
      },
    });
  };

  const openModalUpdateCoach = () => {
    presentUpdateCoach({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail<TCoach>>) => {
        console.log("event.detail.data", event.detail.data);
        if ((event.detail.role as TModalRole) === "confirm") {
          if (event.detail.data) updateCoachMutate(event.detail.data);
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

  const { mutate: updateCoachMutate } = useMutation({
    mutationFn: (currentCoach: TCoach) => updateCoach(currentCoach),
    onSuccess: () => {
      // Invalidate and refetch coaches
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      showToastWithMessage("Coach aggiornato", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const { mutate: deleteCoachMutate } = useMutation({
    mutationFn: () => deleteCoach(currentCoach!.id),
    onSuccess: () => {
      setIsOpen(false);
      // Invalidate and refetch coaches
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      showToastWithMessage("Coach eliminato", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      setIsOpen(false);
      setCurrentCoach(null);
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const handleOpenActionSheet = () => {
    setIsOpen(true);
  };

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

  const imagesMap = useMemo(() => {
    if (!coaches) return {};

    const map: { [key: string]: string } = {};
    coaches.data.forEach((coach: TCoach) => {
      map[coach.id] = getRandomImage();
    });
    return map;
  }, [coaches]);

  if (isCoachesFetching || isCoachesLoading) {
    return <Spinner />;
  }

  if (coachesError) {
    const apiError = coachesError as unknown as TResponseError;
    return <FallbackError statusCode={apiError.statusCode} />;
  }

  return (
    <>
      {/* Presentational Card */}
      <IonCard className="no-horizontal-margin">
        <IonCardHeader>
          <IonCardTitle>Pronti a partire!</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon icon={barbellOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText>Gestisci il team dei coach in pochi gesti:</IonText>
          <ul>
            <li>
              <IonText>Aggiungi un coach con un tap</IonText>
            </li>
            <li>
              <IonText>Scorri verso destra per modificarlo</IonText>
            </li>
            <li>
              <IonText>Scorri verso sinistra per eliminarlo</IonText>
            </li>
          </ul>
          <IonChip
            data-testid="create-coach"
            color={Colors.PRIMARY}
            onClick={() => openModalCreateCoach()}
          >
            <IonLabel>Aggiungi Coach</IonLabel>
            <IonIcon icon={barbellOutline}></IonIcon>
          </IonChip>
        </IonCardContent>
      </IonCard>
      {coaches?.data.map((coach: TCoach) => (
        <IonItemSliding key={coach.id}>
          <IonItemOptions side="start">
            <IonItemOption
              color={Colors.WARNING}
              onClick={() => {
                setCurrentCoach(coach);
                openModalUpdateCoach();
              }}
            >
              <IonIcon icon={createOutline} />
            </IonItemOption>
          </IonItemOptions>
          <IonItem>
            <IonLabel>
              {/* Coach Card */}
              <IonCard className="no-horizontal-margin" key={coach.id}>
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
              <IonIcon icon={trashBinOutline} />
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
