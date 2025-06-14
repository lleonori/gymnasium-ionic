import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from "@ionic/react";
import { barbellOutline } from "ionicons/icons";

const HomeContainer = () => {
  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            Benvenuto <br />
          </IonCardTitle>
          <IonCardSubtitle>
            <IonIcon icon={barbellOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Tramite questa app puoi prenotare il tuo turno in palestra. <br />
          <br />
          "I am. I can. I will. I do."
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default HomeContainer;
