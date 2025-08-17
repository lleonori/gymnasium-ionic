import {
  IonAvatar,
  IonCard,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { bugOutline, sadOutline } from "ionicons/icons";

interface FallbackErrorProps {
  statusCode?: number;
  message?: string;
}

const FallbackError = ({ statusCode, message }: FallbackErrorProps) => {
  return (
    <IonCard>
      <IonList inset={true}>
        <IonItem>
          <IonAvatar aria-hidden="true" slot="start">
            <img alt="User's avatar" src="/assets/error/cry.png" />
          </IonAvatar>
          <IonLabel>
            <h1>Ops... si è verificato qualche problema</h1>
            <br />
            <h2>Contattare Gymnasium se il problema sussiste.</h2>
            <IonChip>
              <IonLabel>Errore: {statusCode ? statusCode : 500}</IonLabel>
              <IonIcon icon={bugOutline}></IonIcon>
            </IonChip>
            {message && (
              <IonChip>
                <IonLabel>{message}</IonLabel>
                <IonIcon icon={sadOutline}></IonIcon>
              </IonChip>
            )}
          </IonLabel>
        </IonItem>
      </IonList>
    </IonCard>
  );
};

export default FallbackError;
