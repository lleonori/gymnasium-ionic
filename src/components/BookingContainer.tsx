import {
  IonActionSheet,
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
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  deleteBooking,
  getBookings,
  saveBooking,
} from "../api/booking/bookingApi";
import { getCalendar } from "../api/calendar/calendarApi";
import { fetchTimetables } from "../api/timetable/timetableApi";
import { TBooking, TCreateBooking } from "../models/booking/bookingModel";
import { TTimetable } from "../models/timetable/timetableModel";
import "./BookingContainer.css";
import Spinner from "./Spinner";

const BookingContainer: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<TCreateBooking>();

  const { data: calendar, isLoading: isCalendarLoading } = useQuery({
    queryFn: () => getCalendar("lorenzo.leonori@gmail.com"),
    queryKey: ["calendar"],
  });

  const { data: bookings, isLoading: isBookingsLoading } = useQuery({
    queryFn: () => getBookings("lorenzo.leonori@gmail.com"),
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
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
  });

  const onSubmit: SubmitHandler<TCreateBooking> = (data) => {
    // Extract the day object from data
    const { day, ...rest } = data;

    // Modify the day in the date object
    const updatedDate = new Date(day);

    // Construct the new data object with the updated day
    const formatData: TCreateBooking = {
      ...rest,
      day: updatedDate,
    };

    saveBookingMutate(formatData);
    resetField("day");
    resetField("hour");
  };

  const handleOpenActionSheet = (bookingId: number) => {
    setCurrentBookingId(bookingId);
    setIsOpen(true);
  };

  const handleDeleteActionSheet = () => {
    deleteBookingMutate();
    resetField("day");
    resetField("hour");
  };

  const { mutate: deleteBookingMutate } = useMutation({
    mutationFn: () => deleteBooking(currentBookingId!),
    onSuccess: () => {
      setIsOpen(false);
      setCurrentBookingId(null);
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
    onError: () => {
      setIsOpen(false);
      setCurrentBookingId(null);
    },
  });

  if (isCalendarLoading && isBookingsLoading && isTimetablesLoading) {
    return <Spinner />;
  }

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
              {calendar?.today && (
                <IonSelectOption value={calendar.today}>
                  {calendar.today.toString()}
                </IonSelectOption>
              )}
              {calendar?.tomorrow && (
                <IonSelectOption value={calendar.tomorrow}>
                  {calendar.tomorrow.toString()}
                </IonSelectOption>
              )}
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
      {bookings && bookings.data.length > 0 && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Le tue prenotazioni</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {bookings.data.map((booking: TBooking) => (
                <IonItemSliding key={booking.id}>
                  <IonItem>
                    <IonLabel>
                      <IonText>{booking.mail}</IonText>
                      <IonText>
                        <p>
                          {booking.day.toString()} {booking.hour}
                        </p>
                      </IonText>
                    </IonLabel>
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption
                      onClick={() => handleOpenActionSheet(booking.id)}
                      color="danger"
                    >
                      Elimina
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      )}

      {/* Action Sheet */}
      <IonActionSheet
        isOpen={isOpen}
        header="Azioni"
        buttons={[
          {
            text: "Elimina",
            role: "destructive",
            data: {
              action: "delete",
            },
            handler: () => {
              handleDeleteActionSheet();
            },
          },
          {
            text: "Cancella",
            role: "cancel",
            data: {
              action: "cancel",
            },
          },
        ]}
      ></IonActionSheet>
    </>
  );
};

export default BookingContainer;
