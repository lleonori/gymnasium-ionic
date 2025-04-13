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
  useIonModal,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { createOutline, trashBinOutline } from "ionicons/icons";
import { useState } from "react";
import { TCoach } from "../../../models/coach/coachModel";
import { TModalRole } from "../../../models/modal/modalModel";
import { Colors } from "../../../utils/enums";
import Error from "../../common/Error";
import Spinner from "../../common/Spinner/Spinner";
import HandlerCoach from "./modal/HandlerCoach";

interface ICoachProps {
  coachs: TCoach[] | undefined;
  isCoachsLoading: boolean;
  coachsError: Error | null;
  handleUpdate: (currentCoach: TCoach) => void;
  handleDelete: (id: number) => void;
}

const CoachContainer = ({
  coachs,
  isCoachsLoading,
  coachsError,
  handleUpdate,
  handleDelete,
}: ICoachProps) => {
  const [currentCoach, setCurrentCoach] = useState<TCoach | null>(null);

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
          if (event.detail.data as TCoach) handleUpdate(event.detail.data);
        }
      },
    });
  };

  if (isCoachsLoading) {
    return <Spinner />;
  }

  if (coachsError) {
    return <Error />;
  }

  return (
    <>
      {coachs?.map((coach: TCoach) => (
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
                handleDelete(coach.id);
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

export default CoachContainer;
