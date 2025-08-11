import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonLabel,
  IonText,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { barbellOutline, rocketOutline } from "ionicons/icons";
import { getCoaches } from "../../../api/coach/coachApi";
import { TCoach } from "../../../models/coach/coachModel";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import { getRandomImage } from "../../../utils/functions";
import FallbackError from "../..//common/FallbackError/FallbackError";
import Spinner from "../../common/Spinner/Spinner";

const CoachDetailsContainer = () => {
  const {
    data: coaches,
    isLoading: isCoachesLoading,
    error: coachesError,
    isFetching: isCoachesFetching,
  } = useQuery({
    queryFn: () => getCoaches(),
    queryKey: ["coaches"],
  });

  if (isCoachesFetching || isCoachesLoading) {
    return <Spinner />;
  }

  if (coachesError) {
    const apiError = coachesError as unknown as TResponseError;
    return <FallbackError statusCode={apiError.statusCode} />;
  }

  return (
    <>
      {/* Coach Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Scendi in campo con i coaches!</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon icon={barbellOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText>Scopri chi ti guiderà nell’allenamento di oggi.</IonText>
        </IonCardContent>
      </IonCard>
      {coaches?.data.map((coach: TCoach) => (
        <IonCard key={coach.id}>
          <IonCardHeader>
            <IonCardTitle>
              Coach <br />
              {coach.name} {coach.surname}
            </IonCardTitle>
            <IonCardSubtitle>
              <IonAvatar>
                <img alt="Coach's avatar" src={getRandomImage()} />
              </IonAvatar>
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {coach?.notes.split(",").map((note: string, index: number) => (
              <IonChip key={index}>
                <IonLabel>{note}</IonLabel>
                <IonIcon icon={rocketOutline}></IonIcon>
              </IonChip>
            ))}
          </IonCardContent>
        </IonCard>
      ))}
    </>
  );
};

export default CoachDetailsContainer;
