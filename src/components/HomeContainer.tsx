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
import { barbell } from "ionicons/icons";
import { getCoachs } from "../api/coach/coachApi";
import { TCoach } from "../models/coach/coachModel";
import Spinner from "./Spinner";

const HomeContainer: React.FC = () => {
  const { data: coachs, isLoading: isCoachsLoading } = useQuery({
    queryFn: () => getCoachs(),
    queryKey: ["coachs"],
  });

  if (isCoachsLoading) {
    return <Spinner />;
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
            <IonIcon aria-hidden="true" icon={barbell} />
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
