import { IonActionSheet, IonButton, IonCol, IonDatetime, IonGrid, IonRow } from '@ionic/react';
import './BookingContainer.css';
import { useState } from 'react';

interface ContainerProps {
  name: string;
}

const BookingContainer: React.FC<ContainerProps> = ({ name }) => {
  const [minDate, setMinDate] = useState(getTodayISOString());
  const [maxDate, setMaxDate] = useState(getTomorrowISOString());
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(''); // State to store the selected date

  const handleDatetimeChange = (event: CustomEvent) => {
    // Handle the change of the IonDatetime component
    const selectedDateTime = event.detail.value;
    setSelectedDate(selectedDateTime);
  };

  const handleButtonClick = () => {
    // Show the IonActionSheet when the default button is clicked
    setShowActionSheet(true);
  };

  const handleActionSheetDismiss = () => {
    // Close the IonActionSheet when dismissed
    setShowActionSheet(false);
  };

  const handleActionSheetSelect = (value: string) => {
    // Handle the selection from the IonActionSheet
    console.log(`Selected option: ${value}`);
    setShowActionSheet(false);
  };


  function getTodayISOString() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to the beginning of the day in UTC
    return today.toISOString().split('T')[0]; // Use only the date part
  }

  function getTomorrowISOString() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0); // Set to the beginning of the day in UTC
    return tomorrow.toISOString().split('T')[0]; // Use only the date part
  }

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonDatetime
            className="full-width"
            min={minDate}
            max={maxDate}
            locale="it-It"
            minuteValues="0"
            hourValues="9,11,13,15,17,19,21"
            hourCycle="h24"
            showDefaultButtons={true}
            size='cover'
          >
            <span slot="title">Seleziona una data</span>
            <span slot="time-label">Orario</span>
          </IonDatetime>
        </IonCol>
      </IonRow>
      <IonRow>
      <IonButton id="open-action-sheet">Open</IonButton>
      <IonActionSheet
        trigger="open-action-sheet"
        header="Actions"
        buttons={[
          {
            text: 'Delete',
            role: 'destructive',
            data: {
              action: 'delete',
            },
          },
          {
            text: 'Share',
            data: {
              action: 'share',
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
            data: {
              action: 'cancel',
            },
          },
        ]}
      ></IonActionSheet>
      </IonRow>
    </IonGrid>
  );
};

export default BookingContainer;
