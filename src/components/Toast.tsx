import { IonToast } from "@ionic/react";
import { useState } from "react";
import { TToast } from "../models/toast/toastModel";

const Toast: React.FC<TToast> = ({ message }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <IonToast
      isOpen={isOpen}
      message={message}
      onDidDismiss={() => setIsOpen(false)}
      duration={5000}
    ></IonToast>
  );
};

export default Toast;
