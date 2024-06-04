import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { arrowForwardCircle, barbell } from "ionicons/icons";
import "./BookingContainer.css";
import { fetchCalendar } from "../api/calendar/calendarApi";
import { fetchBookings } from "../api/booking/bookingApi";
import { IBooking } from "../models/booking/bookingModel";
import { fetchTimetables } from "../api/timetable/timetableApi";
import { ITimetable } from "../models/timetable/timetableModel";

const BookingContainer: React.FC = () => {
  const { data: calendar } = useQuery({
    queryFn: () => fetchCalendar(),
    queryKey: ["calendar"],
  });

  const { data: bookings } = useQuery({
    queryFn: () => fetchBookings(),
    queryKey: ["bookings"],
  });

  const { data: timetables } = useQuery({
    queryFn: () => fetchTimetables(),
    queryKey: ["timetables"],
  });

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Regole di prenotazione</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon aria-hidden="true" icon={barbell} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          È possibile prenotare la tua lezione <em>una volta al giorno.</em>
          <br />
          Per dare la possibilità a tutti di partecipare
          <em>sono disponibili due giorni alla volta.</em>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Prenotati</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonSelect label="Giorno" labelPlacement="floating">
            <IonSelectOption value={calendar?.today}>
              {calendar?.today}
            </IonSelectOption>
            <IonSelectOption value={calendar?.tomorrow}>
              {calendar?.tomorrow}
            </IonSelectOption>
          </IonSelect>

          <IonSelect label="Orario" labelPlacement="floating">
            {timetables?.data.map((timetable: ITimetable) => (
              <IonSelectOption key={timetable.id} value={timetable.id}>
                {timetable.hour}
              </IonSelectOption>
            ))}
          </IonSelect>

          <div className="button-container">
            <IonButton shape="round" size="small">
              <IonIcon slot="icon-only" icon={arrowForwardCircle}></IonIcon>
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Le tue prenotazioni</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {bookings?.data.map((booking: IBooking) => (
              <IonItemSliding key={booking.id}>
                <IonItem>
                  <IonLabel>
                    <h1>
                      {booking?.name} {booking?.surname}
                    </h1>
                    <p> {booking?.booking_at}</p>
                  </IonLabel>
                </IonItem>
                <IonItemOptions>
                  <IonItemOption color="danger">Elimina</IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default BookingContainer;
