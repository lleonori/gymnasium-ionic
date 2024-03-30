import {
  IonActionSheet,
  IonButton,
  IonCol,
  IonDatetime,
  IonGrid,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonRow,
  IonText,
} from "@ionic/react";
import "./BookingContainer.css";
import { useState } from "react";

interface ContainerProps {
  name: string;
}

const BookingContainer: React.FC<ContainerProps> = ({ name }) => {
  const [minDate, setMinDate] = useState(getTodayISOString());
  const [maxDate, setMaxDate] = useState(getTomorrowISOString());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function getTodayISOString() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to the beginning of the day in UTC
    return today.toISOString().split("T")[0]; // Use only the date part
  }

  function getTomorrowISOString() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0); // Set to the beginning of the day in UTC
    return tomorrow.toISOString().split("T")[0]; // Use only the date part
  }

  function formatDate(dateTimeString: string) {
    const [date, time] = dateTimeString.split("T");
    const formattedDate = date;
    const formattedTime = time.substring(0, 5); // Extracting hours and minutes
    return `${formattedDate} ${formattedTime}`;
  }

  const handleDateChange = (event: CustomEvent) => {
    setSelectedDate(formatDate(event.detail.value));
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch("YOUR_API_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include any other headers if needed
        },
        body: JSON.stringify({
          // Include any data you need to send with the request
        }),
      });

      if (!response.ok) {
        setIsOpen(false);
        setSelectedDate(null);
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      setIsOpen(false);
      setSelectedDate(null);
      // Handle the response
      console.log("Response:", responseData);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
    }
  };

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonDatetime
              color="rose"
              min={minDate}
              max={maxDate}
              locale="it-It"
              minuteValues="0"
              hourValues="9,11,13,15,17,19,21"
              hourCycle="h24"
              size="cover"
              onIonChange={handleDateChange}
            >
              {/* <span slot="title">Seleziona una data</span> */}
              <span slot="time-label">Orario</span>
            </IonDatetime>
          </IonCol>
        </IonRow>
        <IonRow class="ion-justify-content-end">
          <IonButton
            id="open-action-sheet"
            color="primary"
            disabled={selectedDate ? false : true}
          >
            {" "}
            Prenotati
          </IonButton>
        </IonRow>
        <IonRow>
          <IonCol class="ion-margin-top">
            <IonText>
              <h1>Le tue prenotazioni</h1>
            </IonText>
            <IonList>
              <IonItemSliding>
                <IonItem>
                  <IonLabel>
                    <IonLabel>
                      <h1>Lorenzo Leonori</h1>
                      <p>Giorno 21-03-2024</p>
                      <p>Orario 19:00</p>
                    </IonLabel>
                  </IonLabel>
                </IonItem>
                <IonItemOptions>
                  <IonItemOption color="danger">Elimina</IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
              <IonItemSliding>
                <IonItem>
                  <IonLabel>
                    <h1>Lorenzo Leonori</h1>
                    <p>Giorno 22-03-2024</p>
                    <p>Orario 17:00</p>
                  </IonLabel>
                </IonItem>
                <IonItemOptions>
                  <IonItemOption color="danger">Elimina</IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            </IonList>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonActionSheet
        trigger="open-action-sheet"
        isOpen={isOpen}
        header="Azioni"
        buttons={[
          {
            text: "Conferma",
            handler: handleConfirm,
          },
          {
            text: "Annulla",
          },
        ]}
        onDidDismiss={() => setIsOpen(false)}
      ></IonActionSheet>
    </>
  );
};

export default BookingContainer;
