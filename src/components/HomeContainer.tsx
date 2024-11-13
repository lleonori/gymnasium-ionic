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
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { barbellOutline } from "ionicons/icons";
import { getCoachs } from "../api/coach/coachApi";
import { TCoach } from "../models/coach/coachModel";
import Error from "./Error";
import Spinner from "./Spinner";

const HomeContainer = () => {
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
      {/* Presentational Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            Benvenuto <br />
          </IonCardTitle>
          <IonCardSubtitle>
            <IonIcon aria-hidden="true" icon={barbellOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Tramite questa app puoi prenotare il tuo turno in palestra. <br />
          <br />
          "I am. I can. I will. I do."
        </IonCardContent>
      </IonCard>

      {/* Coach Card */}
      {coachs?.data.map((coach: TCoach) => (
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

export default HomeContainer;
