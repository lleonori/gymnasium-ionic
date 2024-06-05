import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { arrowForwardCircle, barbell } from "ionicons/icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { fetchTimetables } from "../api/timetable/timetableApi";
import { TBooking, TCreateBooking } from "../models/booking/bookingModel";
import "./BookingContainer.css";
import Spinner from "./Spinner";
import { getCalendar } from "../api/calendar/calendarApi";
import { getBookings, saveBooking } from "../api/booking/bookingApi";
import { TTimetable } from "../models/timetable/timetableModel";

const BookingContainer: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateBooking>();

  const { data: calendar, isLoading: isCalendarLoading } = useQuery({
    queryFn: () => getCalendar(),
    queryKey: ["calendar"],
  });

  const { data: bookings, isLoading: isBookingsLoading } = useQuery({
    queryFn: () => getBookings(),
    queryKey: ["bookings"],
  });

  const { data: timetables, isLoading: isTimetablesLoading } = useQuery({
    queryFn: () => fetchTimetables(),
    queryKey: ["timetables"],
  });

  const { mutate: saveBookingMutate } = useMutation({
    mutationFn: (newBooking: TCreateBooking) => saveBooking(newBooking),
    onSuccess: () => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  if (isCalendarLoading && isBookingsLoading && isTimetablesLoading) {
    return <Spinner />;
  }

  const onSubmit: SubmitHandler<TCreateBooking> = (data) => {
    saveBookingMutate(data);
  };

  return (
    <>
      {/* Presentational Card */}
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
          <em> sono disponibili due giorni alla volta.</em>
        </IonCardContent>
      </IonCard>

      {/* Booking Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Prenotati</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Mail Field */}
            <input
              {...register("mail", {
                value: "lorenzo.leonori@gmail.com",
                required: true,
              })}
              type="hidden"
            />
            {/* Day Field */}
            <IonSelect
              label="Giorno"
              labelPlacement="floating"
              {...register("day", { required: true })}
            >
              <IonSelectOption value={calendar?.today}>
                {calendar?.today}
              </IonSelectOption>
              <IonSelectOption value={calendar?.tomorrow}>
                {calendar?.tomorrow}
              </IonSelectOption>
            </IonSelect>
            {errors.day && <span>Campo obbligatorio</span>}
            {/* Hour Field */}
            <IonSelect
              label="Orario"
              labelPlacement="floating"
              {...register("hour", { required: true })}
            >
              {timetables?.data.map((timetable: TTimetable) => (
                <IonSelectOption key={timetable.id} value={timetable.hour}>
                  {timetable.hour}
                </IonSelectOption>
              ))}
            </IonSelect>
            {errors.hour && <span>Campo obbligatorio</span>}
            {/* Submit */}
            <div className="button-container">
              <IonButton type="submit" shape="round" size="small">
                <IonIcon slot="icon-only" icon={arrowForwardCircle}></IonIcon>
              </IonButton>
            </div>
          </form>
        </IonCardContent>
      </IonCard>

      {/* Your Booking Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Le tue prenotazioni</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {bookings?.data.map((booking: TBooking) => (
              <IonItemSliding key={booking.id}>
                <IonItem>
                  <IonLabel>
                    <IonText>{booking?.mail}</IonText>
                    <IonText>
                      <p>
                        {booking?.day} {booking?.hour}
                      </p>
                    </IonText>
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
