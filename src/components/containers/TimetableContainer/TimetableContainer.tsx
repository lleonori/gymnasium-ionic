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
import { createOutline, timeOutline, trashBinOutline } from "ionicons/icons";
import { useState } from "react";
import {
  deleteTimetable,
  getTimetables,
  updateTimetable,
} from "../../../api/timetable/timetableApi";
import { TModalRole } from "../../../models/modal/modalModel";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import { TSortBy } from "../../../models/sort/sortModel";
import {
  TFilterTimetable,
  TTimetable,
} from "../../../models/timetable/timetableModel";
import { Colors } from "../../../utils/enums";
import { formatTime } from "../../../utils/functions";
import Error from "../../common/Error";
import Spinner from "../../common/Spinner/Spinner";
import HandlerTimetable from "./modal/HandlerTimetable";

const TimetableContainer = () => {
  const queryClient = useQueryClient();

  // timetable sorting
  const [timetableSort] = useState<TSortBy<TTimetable>>({
    sortBy: "startHour",
    orderBy: "asc",
  });
  // timetable filter
  const [filterTimetable] = useState<TFilterTimetable>({});
  // state for ActionSheet
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    isFetching: isTimetablesFetching,
  } = useQuery({
    queryFn: () => getTimetables(filterTimetable, timetableSort),
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

  const handleOpenActionSheet = () => {
    setIsOpen(true);
  };

  const { mutate: deleteTimetableMutate } = useMutation({
    mutationFn: () => deleteTimetable(currentTimetable!.id),
    onSuccess: () => {
      // Invalidate and refetch timetables
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
      showToastWithMessage("Orario eliminato", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      setCurrentTimetable(null);
      setIsOpen(false);
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

  if (isTimetablesLoading || isTimetablesFetching) {
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
              <IonIcon icon={createOutline} />
            </IonItemOption>
          </IonItemOptions>
          <IonItem>
            <IonLabel>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Orari disponibili</IonCardTitle>
                  <IonCardSubtitle>
                    <IonAvatar>
                      <img
                        alt="Timetable's avatar"
                        src="/assets/timetables/watch.png"
                      />
                    </IonAvatar>
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonChip>
                    <IonLabel>
                      {`${formatTime(timetable.startHour)} - ${formatTime(timetable.endHour)}`}
                    </IonLabel>
                    <IonIcon icon={timeOutline} />
                  </IonChip>
                </IonCardContent>
              </IonCard>
            </IonLabel>
          </IonItem>
          <IonItemOptions side="end">
            <IonItemOption
              color={Colors.DANGER}
              onClick={() => {
                handleOpenActionSheet();
                setCurrentTimetable(timetable);
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
              deleteTimetableMutate();
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

export default TimetableContainer;
