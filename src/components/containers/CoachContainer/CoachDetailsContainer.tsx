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
import { barbellOutline } from "ionicons/icons";
import { useMemo } from "react";
import { getCoaches } from "../../../api/coach/coachApi";
import { TCoach } from "../../../models/coach/coachModel";
import { getRandomImage } from "../../../utils/functions";
import FallbackError from "../../common/FallbackError";
import Spinner from "../../common/Spinner/Spinner";

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
    return <FallbackError />;
  }

  return (
    <>
      {/* Coach Card */}
      <IonCard className="no-horizontal-margin">
        <IonCardHeader>
          <IonCardTitle>Scendi in campo con i coach!</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon icon={barbellOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText>Scopri chi ti guiderà nell’allenamento di oggi.</IonText>
        </IonCardContent>
      </IonCard>
      {coaches?.data.map((coach: TCoach) => (
        <IonCard className="no-horizontal-margin" key={coach.id}>
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
