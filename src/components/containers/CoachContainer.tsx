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
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { createOutline, trashBinOutline } from "ionicons/icons";
import { getCoachs } from "../../api/coach/coachApi";
import { TCoach } from "../../models/coach/coachModel";
import { Colors } from "../../utils/enums";
import Error from "../common/Error";
import Spinner from "../common/Spinner/Spinner";

const CoachContainer = () => {
  const {
    data: coachs,
    isLoading: isCoachsLoading,
    error: coachsError,
  } = useQuery({
    queryFn: () => getCoachs(),
    queryKey: ["coachs"],
  });

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
            <IonItemOption color={Colors.WARNING}>
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
            <IonItemOption color={Colors.DANGER}>
              <IonIcon aria-hidden="true" icon={trashBinOutline} />
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      ))}
    </>
  );
};

export default CoachContainer;
