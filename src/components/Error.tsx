import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from "@ionic/react";
import { warningOutline } from "ionicons/icons";

const Error = () => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          Errore <br />
        </IonCardTitle>
        <IonCardSubtitle>
          <IonIcon aria-hidden="true" icon={warningOutline} />
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        C'è qualche problema di connessione? <br />
        <br />
        Contattare Gymnasium se il problema sussiste.
      </IonCardContent>
    </IonCard>
  );
};

export default Error;
