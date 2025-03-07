import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonText,
} from "@ionic/react";
import { warningOutline } from "ionicons/icons";
import { Colors } from "../utils/enums";

const Error = () => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Errore</IonCardTitle>
        <IonCardSubtitle>
          <IonIcon
            aria-hidden="true"
            color={Colors.WARNING}
            icon={warningOutline}
          />
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonText>C'è qualche problema di connessione?</IonText>
        <IonText color={Colors.WARNING}>
          Contattare Gymnasium se il problema sussiste.
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default Error;
