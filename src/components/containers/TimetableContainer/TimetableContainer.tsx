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
  IonList,
  IonText,
  IonToast,
  isPlatform,
  useIonModal,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOutline, timeOutline, trashBinOutline } from "ionicons/icons";
import { useState } from "react";
import {
  deleteTimetable,
  getTimetables,
  saveTimetable,
  updateTimetable,
} from "../../../api/timetable/timetableApi";
import { TModalRole } from "../../../models/modal/modalModel";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import { TSortBy } from "../../../models/sort/sortModel";
import {
  TCreateTimetable,
  TFilterTimetable,
  TTimetable,
} from "../../../models/timetable/timetableModel";
import { Colors } from "../../../utils/enums";
import { formatTime } from "../../../utils/functions";
import FallbackError from "../..//common/FallbackError/FallbackError";
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

  const [presentCreateTimetable, dismissModalCreateTimetable] = useIonModal(
    HandlerTimetable,
    {
      dismiss: (data: TCreateTimetable | null, role: TModalRole) =>
        dismissModalCreateTimetable(data, role),
      mode: "create",
    }
  );

  const openModalCreateTimetable = () => {
    presentCreateTimetable({
      onWillDismiss: (
        event: CustomEvent<OverlayEventDetail<TCreateTimetable>>
      ) => {
        console.log("event.detail.data", event.detail.data);
        if ((event.detail.role as TModalRole) === "confirm") {
          if (event.detail.data) saveTimetableMutate(event.detail.data);
        }
      },
    });
  };

  const [presentUpdateTimetable, dismissModalUpdateTimetable] = useIonModal(
    HandlerTimetable,
    {
      dismiss: (data: TTimetable | null, role: TModalRole) =>
        dismissModalUpdateTimetable(data, role),
      currentTimetable: currentTimetable,
      mode: "update",
    }
  );

  const openModalUpdateTimetable = () => {
    presentUpdateTimetable({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail<TTimetable>>) => {
        console.log("event.detail.data", event.detail.data);
        if ((event.detail.role as TModalRole) === "confirm") {
          if (event.detail.data) updateTimetableMutate(event.detail.data);
        }
      },
    });
  };

  const { mutate: saveTimetableMutate } = useMutation({
    mutationFn: (newTimetable: TCreateTimetable) => saveTimetable(newTimetable),
    onSuccess: () => {
      // Invalidate and refetch Timetables
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
      showToastWithMessage("Orario inserito", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const { mutate: updateTimetableMutate } = useMutation({
    mutationFn: (currentTimetable: TTimetable) =>
      updateTimetable(currentTimetable),
    onSuccess: () => {
      // Invalidate and refetch timetables
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
      queryClient.invalidateQueries({ queryKey: ["weekdayTimes"] });
      showToastWithMessage("Orario aggiornato", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const { mutate: deleteTimetableMutate } = useMutation({
    mutationFn: () => deleteTimetable(currentTimetable!.id),
    onSuccess: () => {
      setIsOpen(false);
      // Invalidate and refetch timetables
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
      queryClient.invalidateQueries({ queryKey: ["weekdayTimes"] });
      showToastWithMessage("Orario eliminato", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      setIsOpen(false);
      setCurrentTimetable(null);
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

  if (isTimetablesFetching || isTimetablesLoading) {
    return <Spinner />;
  }

  if (timetablesError) {
    const apiError = timetablesError as unknown as TResponseError;
    return <FallbackError statusCode={apiError.statusCode} />;
  }

  return (
    <>
      {/* Presentational Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Gestisci i tuoi orari!</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon icon={timeOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText>Tieni sotto controllo gli orari:</IonText>
          <ul>
            <li>
              <IonText>Aggiungi un orario con un tap</IonText>
            </li>
            <li>
              <IonText>Scorri verso destra per modificarlo</IonText>
            </li>
            <li>
              <IonText>Scorri verso sinistra per eliminarlo</IonText>
            </li>
          </ul>
          <IonChip
            data-testid="create-timetable"
            color={Colors.PRIMARY}
            onClick={() => openModalCreateTimetable()}
          >
            Aggiungi Orario<IonIcon icon={timeOutline}></IonIcon>
          </IonChip>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonList inset={true}>
          {timetables?.data?.map((timetable: TTimetable) => (
            <IonItemSliding>
              <IonItemOptions side="start">
                <IonItemOption color={Colors.PRIMARY}>
                  <IonIcon slot="icon-only" icon={createOutline}></IonIcon>
                </IonItemOption>
              </IonItemOptions>
              <IonItem button={true}>
                <IonAvatar aria-hidden="true" slot="start">
                  <img
                    alt="Timetable's avatar"
                    src="/assets/timetables/watch.png"
                  />
                </IonAvatar>
                <IonLabel>
                  <h1>Fascia oraria</h1>
                  <IonChip>
                    <IonLabel>
                      {formatTime(timetable.startHour)} -
                      {formatTime(timetable.endHour)}
                    </IonLabel>
                    <IonIcon icon={timeOutline}></IonIcon>
                  </IonChip>
                </IonLabel>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption color={Colors.DANGER}>
                  <IonIcon slot="icon-only" icon={trashBinOutline}></IonIcon>
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
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
