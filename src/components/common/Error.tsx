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
import { Colors } from "../../utils/enums";

const Error = () => {
  return (
    <IonCard className="no-horizontal-margin">
      <IonCardHeader>
        <IonCardTitle>Errore</IonCardTitle>
        <IonCardSubtitle>
          <IonIcon color={Colors.WARNING} icon={warningOutline} />
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonText>
          <p>C'è qualche problema di connessione?</p>
        </IonText>
        <IonText color={Colors.WARNING}>
          <p>Contattare Gymnasium se il problema sussiste.</p>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default Error;
