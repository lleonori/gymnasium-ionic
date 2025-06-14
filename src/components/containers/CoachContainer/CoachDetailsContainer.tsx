import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonLabel,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getCoaches } from "../../../api/coach/coachApi";
import { TCoach } from "../../../models/coach/coachModel";
import { getRandomImage } from "../../../utils/functions";
import Spinner from "../../common/Spinner/Spinner";
import Error from "../../common/Spinner/Spinner";

const CoachDetailsContainer = () => {
  const {
    data: coaches,
    isLoading: isCoachesLoading,
    error: coachesError,
  } = useQuery({
    queryFn: () => getCoaches(),
    queryKey: ["coaches"],
  });

  const imagesMap = useMemo(() => {
    if (!coaches) return {};

    const map: { [key: string]: string } = {};
    coaches.data.forEach((coach: TCoach) => {
      map[coach.id] = getRandomImage();
    });
    return map;
  }, [coaches]);

  if (isCoachesLoading) {
    return <Spinner />;
  }

  if (coachesError) {
    return <Error />;
  }

  return (
    <>
      {/* Coach Card */}
      {coaches?.data.map((coach: TCoach) => (
        <IonCard key={coach.id}>
          <IonCardHeader>
            <IonCardTitle>
              Coach <br />
              {coach.name} {coach.surname}
            </IonCardTitle>
            <IonCardSubtitle>
              <IonAvatar>
                <img alt="Coach's avatar" src={imagesMap[coach.id]} />
              </IonAvatar>
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {coach?.notes.split(",").map((note: string, index: number) => (
              <IonChip key={index}>
                <IonLabel>{note}</IonLabel>
              </IonChip>
            ))}
          </IonCardContent>
        </IonCard>
      ))}
    </>
  );
};

export default CoachDetailsContainer;
