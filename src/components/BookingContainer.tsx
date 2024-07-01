import { useAuth0 } from "@auth0/auth0-react";
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
  IonToast,
} from "@ionic/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { arrowForwardCircle, barbell, trashBin } from "ionicons/icons";
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
import { Colors } from "../utils/enums";
import { TResponseError } from "../models/problems/responseErrorModel";

const BookingContainer: React.FC = () => {
  const { user } = useAuth0();
  const queryClient = useQueryClient();
  // state for ActionSheet
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // state for selected Booking
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);
  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<TCreateBooking>();

  const { data: calendar, isLoading: isCalendarLoading } = useQuery({
    queryFn: () => getCalendar(),
    queryKey: ["calendar"],
  });

  const { data: bookings, isLoading: isBookingsLoading } = useQuery({
    queryFn: () => getBookings(user?.email!),
    queryKey: ["bookings"],
  });

  const { data: timetables, isLoading: isTimetablesLoading } = useQuery({
    queryFn: () => fetchTimetables(),
    queryKey: ["timetables"],
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
    debugger;

    saveBookingMutate(formatData);
    resetField("day");
    resetField("hour");
  };

  const { mutate: saveBookingMutate } = useMutation({
    mutationFn: (newBooking: TCreateBooking) => saveBooking(newBooking),
    onSuccess: () => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      showToastWithMessage("Lezione prenotata", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

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
      showToastWithMessage("Lezione eliminata", Colors.DANGER);
    },
    onError: () => {
      setIsOpen(false);
      setCurrentBookingId(null);
    },
  });

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

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
          È possibile prenotare <em>una lezione al giorno.</em>
          <br />
          <br />
          Per dare la possibilità a tutti di partecipare
          <em> sono disponibili le date di oggi e domani.</em>
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
                value: user!.email,
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
              <IonButton type="submit" size="small">
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
                      <IonIcon aria-hidden="true" icon={trashBin} />
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

      {/* Toasts */}
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        color={toastColor}
        duration={2000}
        onDidDismiss={() => setShowToast(false)}
      />
    </>
  );
};

export default BookingContainer;
