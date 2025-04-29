import {
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
  useIonModal,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import {
  checkmarkOutline,
  closeOutline,
  createOutline,
  timeOutline,
  trashBinOutline,
} from "ionicons/icons";
import { useState } from "react";
import { TModalRole } from "../../../models/modal/modalModel";
import { TTimetable } from "../../../models/timetable/timetableModel";
import { Colors } from "../../../utils/enums";
import { formatTime } from "../../../utils/functions";
import HandlerTimetable from "./modal/HandlerTimetable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTimetables,
  updateTimetable,
  deleteTimetable,
} from "../../../api/timetable/timetableApi";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import Spinner from "../../common/Spinner/Spinner";
import Error from "../../common/Error";

const TimetableContainer = () => {
  const queryClient = useQueryClient();

  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");
  // state for currentTimetable
  const [currentTimetable, setCurrentTimetable] = useState<TTimetable | null>(
    null
  );

  const {
    data: timetables,
    isLoading: isTimetablesLoading,
    error: timetablesError,
  } = useQuery({
    queryFn: () => getTimetables(),
    queryKey: ["timetables"],
  });

  const [present, dismissModal] = useIonModal(HandlerTimetable, {
    dismiss: (data: TTimetable | null, role: TModalRole) =>
      dismissModal(data, role),
    currentTimetable: currentTimetable,
    mode: "update",
  });

  const openModal = () => {
    present({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
        console.log("event.detail.data", event.detail.data);
        if ((event.detail.role as TModalRole) === "confirm") {
          if (event.detail.data as TTimetable)
            updateTimetableMutate(event.detail.data);
        }
      },
    });
  };

  const { mutate: updateTimetableMutate } = useMutation({
    mutationFn: (currentTimetable: TTimetable) =>
      updateTimetable(currentTimetable),
    onSuccess: () => {
      // Invalidate and refetch timetables
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
      showToastWithMessage("Orario aggiornato", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const { mutate: deleteTimetableMutate } = useMutation({
    mutationFn: (id: number) => deleteTimetable(id),
    onSuccess: () => {
      // Invalidate and refetch timetables
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
      showToastWithMessage("Orario eliminato", Colors.SUCCESS);
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

  if (isTimetablesLoading) {
    return <Spinner />;
  }

  if (timetablesError) {
    return <Error />;
  }

  return (
    <>
      {timetables?.data?.map((timetable: TTimetable) => (
        <IonItemSliding key={timetable.id}>
          <IonItemOptions side="start">
            <IonItemOption
              color={Colors.WARNING}
              onClick={() => {
                setCurrentTimetable(timetable);
                openModal();
              }}
            >
              <IonIcon aria-hidden="true" icon={createOutline} />
            </IonItemOption>
          </IonItemOptions>
          <IonItem>
            <IonLabel>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>{formatTime(timetable.hour)}</IonCardTitle>
                  <IonCardSubtitle>
                    <IonIcon aria-hidden="true" icon={timeOutline} />
                  </IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonLabel>
          </IonItem>
          <IonItemOptions side="end">
            <IonItemOption
              color={Colors.DANGER}
              onClick={() => {
                deleteTimetableMutate(timetable.id);
              }}
            >
              <IonIcon aria-hidden="true" icon={trashBinOutline} />
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      ))}
    </>
  );
};

export default TimetableContainer;
