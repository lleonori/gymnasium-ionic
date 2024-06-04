import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { barbell } from "ionicons/icons";
import { ICoach } from "../models/coach/coachModel";
import "./HomeContainer.css";
import { fetchCoachs } from "../api/coach/coachApi";

const HomeContainer: React.FC = () => {
  const { data: coachs, isLoading } = useQuery({
    queryFn: () => fetchCoachs(),
    queryKey: ["coachs"],
  });

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  // const { user, isLoading } = useAuth0();

  // if (isLoading) {
  //   return <div>Loading ...</div>;
  // }

  // if (!user) return null;

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            Benvenuto <br />
            {/* {user.name} */}
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
      {coachs?.data.map((coach: ICoach) => (
        <IonCard key={coach.id}>
          <IonCardHeader>
            <IonCardTitle>
              Coach <br />
              {coach.name} {coach.surname}
            </IonCardTitle>
            <IonCardSubtitle>
              <IonAvatar>
                <img
                  alt="Silhouette of a person's head"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
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
