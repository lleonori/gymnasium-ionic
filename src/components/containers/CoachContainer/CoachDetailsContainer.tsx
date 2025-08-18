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
  IonLabel,
  IonList,
  IonText,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { barbellOutline, rocketOutline } from "ionicons/icons";
import { useMemo } from "react";

import { getCoaches } from "../../../api/coach/coachApi";
import { TCoach } from "../../../models/coach/coachModel";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import FallbackError from "../..//common/FallbackError/FallbackError";
import Spinner from "../../common/Spinner/Spinner";
import { generateImages } from "../../../utils/functions";

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

  const coachImages = useMemo(
    () => (coaches ? generateImages(coaches.data) : {}),
    [coaches]
  );

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
      <IonCard>
        <IonList inset={true}>
          {coaches?.data.map((coach: TCoach) => (
            <IonItem key={coach.id}>
              <IonAvatar aria-hidden="true" slot="start">
                <img alt="Coach's avatar" src={coachImages[coach.id]} />
              </IonAvatar>
              <IonLabel>
                <h1>
                  {coach.name} {coach.surname}
                </h1>
                {coach?.notes.split(",").map((note: string, index: number) => (
                  <IonChip key={index}>
                    <IonLabel>{note}</IonLabel>
                    <IonIcon icon={rocketOutline}></IonIcon>
                  </IonChip>
                ))}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonCard>
    </>
  );
};

export default CoachDetailsContainer;
