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
import {
  arrowForwardCircleOutline,
  barbellOutline,
  trashBinOutline,
} from "ionicons/icons";
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
import { TResponseError } from "../models/problems/responseErrorModel";
import { TTimetable } from "../models/timetable/timetableModel";
import { Colors } from "../utils/enums";
import "./BookingContainer.css";
import Error from "./Error";
import Spinner from "./Spinner";

const BookingContainer = () => {
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
  // state for selected day
  const [selectedDay, setSelectedDay] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm<TCreateBooking>();

  const {
    data: calendar,
    isLoading: isCalendarLoading,
    error: calendarError,
    isFetching: isCalendarFetching,
  } = useQuery({
    queryFn: () => getCalendar(),
    queryKey: ["calendar"],
  });

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    error: bookingsError,
    isFetching: isBookingsFetching,
  } = useQuery({
    queryFn: () => getBookings(user!.email!),
    queryKey: ["bookings"],
  });

  const {
    data: timetables,
    isLoading: isTimetablesLoading,
    error: timetablesError,
    isFetching: isTimetablesFetching,
  } = useQuery({
    queryFn: () => fetchTimetables(selectedDay),
    queryKey: ["timetables", selectedDay],
    // query enabled only if selectedDay is set
    enabled: !!selectedDay,
  });

  // when the day changes, fetch the timetables
  const handleDayChange = (day: string) => {
    // set the selected day
    setSelectedDay(day);
    // update the form value for day
    setValue("day", new Date(day));
    clearErrors("day");
  };

  const onSubmit: SubmitHandler<TCreateBooking> = (data) => {
    // Extract the day object from data
    const { day, ...rest } = data;

    // Modify the day string in the date object
    const updatedDate = new Date(day);
    const fullname = user?.name;

    // Construct the new data object with the updated day
    const formatData: TCreateBooking = {
      ...rest,
      fullname: fullname,
      day: updatedDate,
    };

    saveBookingMutate(formatData);
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
  };

  const { mutate: deleteBookingMutate } = useMutation({
    mutationFn: () => deleteBooking(currentBookingId!),
    onSuccess: () => {
      setIsOpen(false);
      setCurrentBookingId(null);
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      showToastWithMessage("Lezione eliminata", Colors.SUCCESS);
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

  if (isCalendarLoading || isBookingsLoading || isTimetablesLoading) {
    return <Spinner />;
  }

  if (isCalendarFetching || isBookingsFetching || isTimetablesFetching) {
    return <Spinner />;
  }

  if (calendarError || bookingsError || timetablesError) {
    return <Error />;
  }

  return (
    <>
      {/* Presentational Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Regole</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon aria-hidden="true" icon={barbellOutline} />
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
          <IonCardTitle>Scegli data e orario</IonCardTitle>
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
              value={selectedDay}
              labelPlacement="floating"
              {...register("day", {
                required: true,
              })}
              onIonChange={(e) => {
                handleDayChange(e.detail.value);
              }}
            >
              <div slot="label">
                Giorno
                {errors.day && <IonText color="danger">(Obbligatorio)</IonText>}
              </div>
              {calendar?.today && (
                <IonSelectOption value={calendar.today}>
                  {calendar.today}
                </IonSelectOption>
              )}
              {calendar?.tomorrow && (
                <IonSelectOption value={calendar.tomorrow}>
                  {calendar.tomorrow}
                </IonSelectOption>
              )}
            </IonSelect>
            {/* Hour Field */}
            <IonSelect
              labelPlacement="floating"
              {...register("hour", { required: true })}
              onIonChange={() => clearErrors("hour")}
            >
              <div slot="label">
                Orario
                {errors.hour && (
                  <IonText color="danger">(Obbligatorio)</IonText>
                )}
              </div>
              {timetables?.data.map((timetable: TTimetable) => (
                <IonSelectOption key={timetable.id} value={timetable.hour}>
                  {/* 11:00:00Z clients needs to see 11:00 */}
                  {timetable.hour.split(":")[0]}:00
                </IonSelectOption>
              ))}
            </IonSelect>
            {/* Submit */}
            <div className="button-container">
              <IonButton type="submit" size="small">
                <IonIcon
                  slot="icon-only"
                  icon={arrowForwardCircleOutline}
                ></IonIcon>
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
                      <IonText>
                        {booking.fullname ? booking.fullname : booking.mail}
                      </IonText>
                      <IonText>
                        <p>
                          {booking.day.toString()} {booking.hour.split(":")[0]}
                          :00
                        </p>
                      </IonText>
                    </IonLabel>
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption
                      onClick={() => handleOpenActionSheet(booking.id)}
                      color="danger"
                    >
                      <IonIcon aria-hidden="true" icon={trashBinOutline} />
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
