import { IonText } from "@ionic/react";
import { Colors } from "../../../utils/enums";
import "./FallbackError.css";

interface FallbackErrorProps {
  statusCode?: number;
}

const FallbackError = ({ statusCode }: FallbackErrorProps) => {
  return (
    <div className="container">
      <IonText color={Colors.PRIMARY}>
        <h1>Ops... si è verificato qualche problema</h1>
      </IonText>
      <IonText>
        <p>Contattare Gymnasium se il problema sussiste.</p>
      </IonText>
      <IonText color={Colors.MEDIUM}>
        <em>Error code: {statusCode ? statusCode : 500}</em>
      </IonText>
      <img
        className="fallback-image"
        alt="Logo's avatar"
        src="/assets/Gymnasium_completo.svg"
      />
    </div>
  );
};

export default FallbackError;
