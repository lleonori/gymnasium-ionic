import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  addCircleOutline,
  closeCircleOutline,
  timeOutline,
} from "ionicons/icons";
import { useState } from "react";

import { TModalRole } from "../../../../models/modal/modalModel";
import { TTimetable } from "../../../../models/timetable/timetableModel";
import {
  TCreateWeekdayTimes,
  TWeekdayTime,
  TWeekdayTimesHour,
} from "../../../../models/weekday-time/weekdayTimeModel";
import { Colors } from "../../../../utils/enums";
import { formatTime } from "../../../../utils/functions";

interface ICreateWeekdayTimeProps {
  dismiss: (data: TCreateWeekdayTimes | null, role: TModalRole) => void;
  currentWeekdayTime: TWeekdayTime;
  timetables: TTimetable[];
}

const HandlerAssignTimetable = ({
  dismiss,
  currentWeekdayTime,
  timetables,
}: ICreateWeekdayTimeProps) => {
  const [assignedTimes, setAssignedTimes] = useState<Array<TWeekdayTimesHour>>(
    currentWeekdayTime.hour
  );

  const timesToBeAssigned = timetables.filter(
    (timetable) =>
      !assignedTimes.some((assignedTime) => assignedTime.id === timetable.id)
  );

  const addToAssignedTimes = (selectedHour: TWeekdayTimesHour) => {
    setAssignedTimes((prevState) =>
      [...prevState, selectedHour].sort((a, b) => a.hour.localeCompare(b.hour))
    );
  };

  const addToTimesToBeAssigned = (selectedHour: TWeekdayTimesHour) => {
    setAssignedTimes((prevState) =>
      prevState.filter((hour) => hour !== selectedHour)
    );
  };

  const onSubmit = () => {
    const createWeekdayTimes: TCreateWeekdayTimes = {
      weekdayId: currentWeekdayTime.weekdayId,
      timetableId: assignedTimes.map((assignedTime) => assignedTime.id),
    };

    dismiss(createWeekdayTimes, "confirm");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color={Colors.MEDIUM}
              onClick={() => dismiss(null, "cancel")}
            >
              Annulla
            </IonButton>
          </IonButtons>
          <IonTitle>Modifica Assegnazione</IonTitle>
          <IonButtons slot="end">
            <IonButton
              data-testid="update-weekday-times"
              type="button"
              strong={true}
              onClick={onSubmit}
            >
              Modifica
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Card orari assegnati*/}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Orari assegnati</IonCardTitle>
            <IonCardSubtitle>
              <IonIcon icon={timeOutline} />
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {assignedTimes.map((assignedTime) => (
              <IonChip
                data-testid={`assigned-time-${assignedTime.id}`}
                key={assignedTime.id}
                onClick={() => addToTimesToBeAssigned(assignedTime)}
              >
                <IonLabel>{formatTime(assignedTime.hour)}</IonLabel>
                <IonIcon icon={closeCircleOutline}></IonIcon>
              </IonChip>
            ))}
          </IonCardContent>
        </IonCard>
        {/* Card orari da assegnare*/}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Orari da assegnare</IonCardTitle>
            <IonCardSubtitle>
              <IonIcon icon={timeOutline} />
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {timesToBeAssigned.map((timeToBeAssigned) => (
              <IonChip
                key={timeToBeAssigned.id}
                onClick={() =>
                  addToAssignedTimes({
                    id: timeToBeAssigned.id,
                    hour: timeToBeAssigned.startHour,
                  })
                }
              >
                <IonLabel>{formatTime(timeToBeAssigned.startHour)}</IonLabel>
                <IonIcon icon={addCircleOutline}></IonIcon>
              </IonChip>
            ))}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default HandlerAssignTimetable;
