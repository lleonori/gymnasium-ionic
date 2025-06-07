import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { timeOutline } from "ionicons/icons";
import { useState } from "react";
import { saveTimetable } from "../../api/timetable/timetableApi";
import HandlerTimetable from "../../components/containers/TimetableContainer/modal/HandlerTimetable";
import TimetableContainer from "../../components/containers/TimetableContainer/TimetableContainer";
import { TModalRole } from "../../models/modal/modalModel";
import { TResponseError } from "../../models/problems/responseErrorModel";
import { TCreateTimetable } from "../../models/timetable/timetableModel";
import { Colors } from "../../utils/enums";

const Timetable = () => {
  const queryClient = useQueryClient();

  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");

  const [present, dismissModal] = useIonModal(HandlerTimetable, {
    dismiss: (data: TCreateTimetable | null, role: TModalRole) =>
      dismissModal(data, role),
    mode: "create",
  });

  const openModal = () => {
    present({
      onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
        console.log("event.detail.data", event.detail.data);
        if ((event.detail.role as TModalRole) === "confirm") {
          if (event.detail.data as TCreateTimetable)
            saveTimetableMutate(event.detail.data);
        }
      },
    });
  };

  const { mutate: saveTimetableMutate } = useMutation({
    mutationFn: (newTimetable: TCreateTimetable) => saveTimetable(newTimetable),
    onSuccess: () => {
      // Invalidate and refetch Timetables
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
      showToastWithMessage("Orario inserito", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Orari</IonTitle>
          <IonButtons collapse={true} slot="end">
            <IonButton onClick={() => openModal()}>Aggiungi</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Orari</IonTitle>
            <IonChip
              data-testid="create-timetable"
              color={Colors.PRIMARY}
              onClick={() => openModal()}
            >
              Aggiungi Orario<IonIcon icon={timeOutline}></IonIcon>
            </IonChip>
          </IonToolbar>
        </IonHeader>
        <TimetableContainer />
      </IonContent>
      {/* Toasts */}
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        color={toastColor}
        duration={2000}
        onDidDismiss={() => setShowToast(false)}
      />
    </IonPage>
  );
};

export default Timetable;
