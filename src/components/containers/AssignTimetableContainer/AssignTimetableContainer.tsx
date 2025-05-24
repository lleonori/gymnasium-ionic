import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
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
import { createOutline, timeOutline } from "ionicons/icons";
import { useState } from "react";
import { getTimetables } from "../../../api/timetable/timetableApi";
import {
  getWeekdayTimes,
  saveWeekdayTime,
} from "../../../api/weekday-time/weekdayTimeApi";
import { TModalRole } from "../../../models/modal/modalModel";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import { TFilterTimetable } from "../../../models/timetable/timetableModel";
import {
  TCreateWeekdayTimes,
  TWeekdayTime,
} from "../../../models/weekday-time/weekdayTimeModel";
import { Colors } from "../../../utils/enums";
import { formatTime } from "../../../utils/functions";
import Error from "../../common/Error";
import Spinner from "../../common/Spinner/Spinner";
import HandlerAssignTimetable from "./modal/HandlerAssignTimetable";

const AssignTimetableContainer = () => {
  const queryClient = useQueryClient();

  const [currentWeekdayTime, setCurrentWeekdayTime] =
    useState<TWeekdayTime | null>(null);
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
  } = useQuery({
    queryFn: () => getWeekdayTimes(),
    queryKey: ["weekdayTimes"],
  });

  const {
    data: timetables,
    isLoading: isTimetablesLoading,
    error: timetablesError,
  } = useQuery({
    queryFn: () => getTimetables(filterTimetable),
    queryKey: ["timetables"],
  });

  const [present, dismissModal] = useIonModal(HandlerAssignTimetable, {
    dismiss: (data: TCreateWeekdayTimes | null, role: TModalRole) =>
      dismissModal(data, role),
    currentWeekdayTime: currentWeekdayTime,
    timetables: timetables?.data,
  });

  const openModal = () => {
    present({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
        console.log("event.detail.data", event.detail.data);
        if ((event.detail.role as TModalRole) === "confirm") {
          if (event.detail.data as TCreateWeekdayTimes)
            saveWeekdayTimeMutate(event.detail.data);
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

  if (isWeekdayTimesLoading || isTimetablesLoading) {
    return <Spinner />;
  }

  if (weekdayTimesError || timetablesError) {
    return <Error />;
  }

  return (
    <>
      {weekdayTimes?.data?.map((weekdayTime) => (
        <IonItemSliding key={weekdayTime.weekdayId}>
          <IonItemOptions side="start">
            <IonItemOption
              color={Colors.WARNING}
              onClick={() => {
                openModal();
                setCurrentWeekdayTime(weekdayTime);
              }}
            >
              <IonIcon aria-hidden="true" icon={createOutline} />
            </IonItemOption>
          </IonItemOptions>
          <IonItem>
            <IonLabel>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>{weekdayTime.weekdayName}</IonCardTitle>
                  <IonAvatar>
                    <img
                      alt="Timetable's avatar"
                      src="/assets/weekdayTimes/calendar.png"
                    />
                  </IonAvatar>
                </IonCardHeader>
                <IonCardContent>
                  {weekdayTime.hour.map((hh) => (
                    <IonChip key={hh.id}>
                      <IonLabel>{formatTime(hh.hour)}</IonLabel>
                      <IonIcon icon={timeOutline}></IonIcon>
                    </IonChip>
                  ))}
                </IonCardContent>
              </IonCard>
            </IonLabel>
          </IonItem>
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

export default AssignTimetableContainer;
