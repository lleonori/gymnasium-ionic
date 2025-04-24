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
import Error from "../../common/Error";
import Spinner from "../../common/Spinner/Spinner";
import HandlerTimetable from "./modal/HandlerTimetable";
import { formatTime } from "../../../utils/functions";

interface ITimetablesContainerProps {
  timetables: TTimetable[] | undefined;
  isTimetablesLoading: boolean;
  timetablesError: Error | null;
  handleUpdate: (currentTimetable: TTimetable) => void;
  handleDelete: (id: number) => void;
}

const TimetableContainer = ({
  timetables,
  isTimetablesLoading,
  timetablesError,
  handleUpdate,
  handleDelete,
}: ITimetablesContainerProps) => {
  const [currentTimetable, setCurrentTimetable] = useState<TTimetable | null>(
    null
  );

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
          if (event.detail.data as TTimetable) handleUpdate(event.detail.data);
        }
      },
    });
  };

  if (isTimetablesLoading) {
    return <Spinner />;
  }

  if (timetablesError) {
    return <Error />;
  }

  return (
    <>
      {timetables?.map((timetable: TTimetable) => (
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
                <IonCardContent>
                  <IonChip color={Colors.MEDIUM}>
                    {timetable.isValidOnWeekend ? (
                      <>
                        Valido nel Weekend
                        <IonIcon icon={checkmarkOutline}></IonIcon>
                      </>
                    ) : (
                      <>
                        Non valido nel Weekend
                        <IonIcon icon={closeOutline}></IonIcon>
                      </>
                    )}
                  </IonChip>
                </IonCardContent>
              </IonCard>
            </IonLabel>
          </IonItem>
          <IonItemOptions side="end">
            <IonItemOption
              color={Colors.DANGER}
              onClick={() => {
                handleDelete(timetable.id);
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
