import { IonSpinner } from "@ionic/react";
import "./Spinner.css";

const Spinner: React.FC = () => {
  return (
    <div className="container">
      <IonSpinner></IonSpinner>
    </div>
  );
};

export default Spinner;
