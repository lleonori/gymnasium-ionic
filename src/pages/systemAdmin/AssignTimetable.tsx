import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { calendarNumberOutline, createOutline } from "ionicons/icons";
import { useState } from "react";
import { getWeekdays } from "../../api/weekday/weekdayApi";
import { Colors } from "../../utils/enums";

const AssignTimetable = () => {
  const queryClient = useQueryClient();

  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");

  const {
    data: weekdays,
    isLoading: isWeekdaysLoading,
    error: weekdaysError,
  } = useQuery({
    queryFn: () => getWeekdays(),
    queryKey: ["weekdays"],
  });

  //   const [present, dismissModal] = useIonModal(HandlerTimetable, {
  //     dismiss: (data: TCreateTimetable | null, role: TModalRole) =>
  //       dismissModal(data, role),
  //     mode: "create",
  //   });

  //   const openModal = () => {
  //     present({
  //       onWillDismiss: (event: CustomEvent<OverlayEventDetail>) => {
  //         console.log("event.detail.data", event.detail.data);
  //         if ((event.detail.role as TModalRole) === "confirm") {
  //           if (event.detail.data as TCreateTimetable)
  //             saveTimetableMutate(event.detail.data);
  //         }
  //       },
  //     });
  //   };

  //   const { mutate: saveTimetableMutate } = useMutation({
  //     mutationFn: (newTimetable: TCreateTimetable) => saveTimetable(newTimetable),
  //     onSuccess: () => {
  //       // Invalidate and refetch Timetables
  //       queryClient.invalidateQueries({ queryKey: ["timetables"] });
  //       showToastWithMessage("Orario inserito", Colors.SUCCESS);
  //     },
  //     onError: (error: TResponseError) => {
  //       showToastWithMessage(error.message, Colors.DANGER);
  //     },
  //   });

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Assegna Orari</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Assegna Orari</IonTitle>
          </IonToolbar>
        </IonHeader>
        {weekdays?.data.map((weekday) => (
          <IonItemSliding key={weekday.id}>
            <IonItemOptions side="start">
              <IonItemOption
                color={Colors.WARNING}
                // onClick={() => {
                //   openModal();
                // }}
              >
                <IonIcon aria-hidden="true" icon={createOutline} />
              </IonItemOption>
            </IonItemOptions>
            <IonItem>
              <IonLabel>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{weekday.name}</IonCardTitle>
                    <IonCardSubtitle>
                      <IonIcon
                        aria-hidden="true"
                        icon={calendarNumberOutline}
                      />
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent></IonCardContent>
                </IonCard>
              </IonLabel>
            </IonItem>
          </IonItemSliding>
        ))}
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

export default AssignTimetable;
