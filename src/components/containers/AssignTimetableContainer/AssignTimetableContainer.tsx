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
  IonList,
  IonText,
  IonToast,
  useIonModal,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { briefcaseOutline, createOutline, timeOutline } from "ionicons/icons";
import { useState } from "react";
import { getTimetables } from "../../../api/timetable/timetableApi";
import {
  getWeekdayTimes,
  saveWeekdayTime,
} from "../../../api/weekday-time/weekdayTimeApi";
import { TModalRole } from "../../../models/modal/modalModel";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import { TSortBy } from "../../../models/sort/sortModel";
import {
  TFilterTimetable,
  TTimetable,
} from "../../../models/timetable/timetableModel";
import {
  TCreateWeekdayTimes,
  TWeekdayTime,
} from "../../../models/weekday-time/weekdayTimeModel";
import { Colors } from "../../../utils/enums";
import { formatTime } from "../../../utils/functions";
import Spinner from "../../common/Spinner/Spinner";
import HandlerAssignTimetable from "./modal/HandlerAssignTimetable";
import FallbackError from "../../common/FallbackError/FallbackError";

const AssignTimetableContainer = () => {
  const queryClient = useQueryClient();

  const [currentWeekdayTime, setCurrentWeekdayTime] =
    useState<TWeekdayTime | null>(null);
  // timetable sorting
  const [timetableSort] = useState<TSortBy<TTimetable>>({
    sortBy: "startHour",
    orderBy: "asc",
  });
  // timetable filter
  const [filterTimetable, _] = useState<TFilterTimetable>({});
  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");

  const {
    data: weekdayTimes,
    isLoading: isWeekdayTimesLoading,
    error: weekdayTimesError,
    isFetching: isWeekdayTimesFetching,
  } = useQuery({
    queryFn: () => getWeekdayTimes(),
    queryKey: ["weekdayTimes"],
  });

  const {
    data: timetables,
    isLoading: isTimetablesLoading,
    error: timetablesError,
    isFetching: isTimetablesFetching,
  } = useQuery({
    queryFn: () => getTimetables(filterTimetable, timetableSort),
    queryKey: ["timetables"],
  });

  const [presentUpdateAssignTimetables, dismissModalUpdateAssignTimetables] =
    useIonModal(HandlerAssignTimetable, {
      dismiss: (data: TCreateWeekdayTimes | null, role: TModalRole) =>
        dismissModalUpdateAssignTimetables(data, role),
      currentWeekdayTime: currentWeekdayTime,
      timetables: timetables?.data,
    });

  const openModalUpdateAssignTimetables = () => {
    presentUpdateAssignTimetables({
      onWillDismiss: (
        event: CustomEvent<OverlayEventDetail<TCreateWeekdayTimes>>
      ) => {
        console.log("event.detail.data", event.detail.data);
        if ((event.detail.role as TModalRole) === "confirm") {
          if (event.detail.data) saveWeekdayTimeMutate(event.detail.data);
        }
      },
    });
  };

  const { mutate: saveWeekdayTimeMutate } = useMutation({
    mutationFn: (currentWeekdayTime: TCreateWeekdayTimes) =>
      saveWeekdayTime(currentWeekdayTime),
    onSuccess: () => {
      // Invalidate and refetch Timetables
      queryClient.invalidateQueries({ queryKey: ["weekdayTimes"] });
      showToastWithMessage("Assegnazione aggiornata", Colors.SUCCESS);
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

  if (
    isWeekdayTimesFetching ||
    isTimetablesFetching ||
    isWeekdayTimesLoading ||
    isTimetablesLoading
  ) {
    return <Spinner />;
  }

  if (weekdayTimesError) {
    const apiError = weekdayTimesError as unknown as TResponseError;
    return <FallbackError statusCode={apiError.statusCode} />;
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
          <IonCardTitle>Organizzati al meglio!</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon icon={briefcaseOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText>Gestisci gli orari settimanali:</IonText>
          <ul>
            <li>
              <IonText>Scorri un giorno verso destra per modificarlo</IonText>
            </li>
          </ul>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonList inset={true}>
          {weekdayTimes?.data?.map((weekdayTime) => (
            <IonItemSliding key={weekdayTime.weekdayId}>
              <IonItemOptions side="start">
                <IonItemOption
                  color={Colors.WARNING}
                  onClick={() => {
                    setCurrentWeekdayTime(weekdayTime);
                    openModalUpdateAssignTimetables();
                  }}
                >
                  <IonIcon slot="icon-only" icon={createOutline}></IonIcon>
                </IonItemOption>
              </IonItemOptions>
              <IonItem button={true}>
                <IonAvatar aria-hidden="true" slot="start">
                  <img
                    alt="Timetable's avatar"
                    src="/assets/weekdayTimes/calendar.png"
                  />
                </IonAvatar>
                <IonLabel>
                  <IonCardTitle>{weekdayTime.weekdayName}</IonCardTitle>
                  {weekdayTime.hour.map((hh) => (
                    <IonChip key={hh.id}>
                      <IonLabel>{formatTime(hh.hour)}</IonLabel>
                      <IonIcon icon={timeOutline}></IonIcon>
                    </IonChip>
                  ))}
                </IonLabel>
              </IonItem>
            </IonItemSliding>
          ))}
        </IonList>
      </IonCard>
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

export default AssignTimetableContainer;
