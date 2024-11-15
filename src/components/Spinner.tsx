import { IonSpinner } from "@ionic/react";
import "./Spinner.css";

const Spinner = () => {
  return (
    <div className="container">
      <IonSpinner name="dots"></IonSpinner>
    </div>
  );
};

export default Spinner;
