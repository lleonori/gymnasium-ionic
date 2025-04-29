import { useAuth0 } from "@auth0/auth0-react";
import {
  IonActionSheet,
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
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
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  deleteBooking,
  getBookings,
  saveBooking,
} from "../../../api/booking/bookingApi";
import { getCalendar } from "../../../api/calendar/calendarApi";
import { getTimetablesByDay } from "../../../api/timetable/timetableApi";
import { TBooking, TCreateBooking } from "../../../models/booking/bookingModel";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import { TTimetable } from "../../../models/timetable/timetableModel";
import { TUser } from "../../../models/user/userModel";
import { Colors } from "../../../utils/enums";
import { formatTime, getRandomImage } from "../../../utils/functions";
import Error from "../../common/Error";
import Spinner from "../../common/Spinner/Spinner";

const BookingContainer = () => {
  const { user } = useAuth0();
  const extendedUser = user as TUser;
  const queryClient = useQueryClient();

  // state for ActionSheet
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // state for selected Booking
  const [currentBooking, setCurrentBooking] = useState<TBooking | null>(null);
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
    queryFn: () => getBookings(extendedUser!.email!),
    queryKey: ["bookings"],
  });

  const {
    data: timetables,
    isLoading: isTimetablesLoading,
    error: timetablesError,
    isFetching: isTimetablesFetching,
  } = useQuery({
    queryFn: () => getTimetablesByDay(selectedDay),
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
    const { day, hour, ...rest } = data;

    // Modify the day string in the date object
    const updatedDate = new Date(day);
    const updatedHour = `${hour}Z`;
    const fullname = extendedUser?.name;

    // Construct the new data object with the updated day
    const formatData: TCreateBooking = {
      ...rest,
      fullname: fullname,
      day: updatedDate,
      hour: updatedHour,
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

  const handleOpenActionSheet = () => {
    setIsOpen(true);
  };

  const { mutate: deleteBookingMutate } = useMutation({
    mutationFn: () => deleteBooking(currentBooking!.id),
    onSuccess: () => {
      setIsOpen(false);
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      showToastWithMessage("Lezione eliminata", Colors.SUCCESS);
    },
    onError: (error: TResponseError) => {
      setCurrentBooking(null);
      setIsOpen(false);
      showToastWithMessage(error.message, Colors.DANGER);
    },
  });

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

  const imagesMap = useMemo(() => {
    if (!bookings) return {};

    const map: { [key: string]: string } = {};
    bookings.data.forEach((booking: TBooking) => {
      map[booking.id] = getRandomImage();
    });
    return map;
  }, [bookings]);

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
                value: extendedUser!.email,
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
                {errors.day && (
                  <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                )}
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
                  <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                )}
              </div>
              {timetables?.data.map((timetable: TTimetable) => (
                <IonSelectOption key={timetable.id} value={timetable.hour}>
                  {formatTime(timetable.hour)}
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
                    <IonAvatar>
                      <img alt="User's avatar" src={imagesMap[booking.id]} />
                    </IonAvatar>
                    <IonLabel>
                      <IonText className="ion-margin-start">
                        {booking.fullname ?? booking.mail}
                      </IonText>
                      <div className="ion-margin-start">
                        <IonChip color={Colors.MEDIUM}>
                          {formatTime(booking.hour)}
                        </IonChip>
                        <IonChip
                          className="ion-margin-start"
                          color={Colors.PRIMARY}
                        >
                          {booking.day.toString()}
                        </IonChip>
                      </div>
                    </IonLabel>
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption
                      onClick={() => {
                        handleOpenActionSheet();
                        setCurrentBooking(booking);
                      }}
                      color={Colors.DANGER}
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
              deleteBookingMutate();
            },
          },
          {
            text: "Annulla",
            role: "cancel",
            data: {
              action: "cancel",
            },
          },
        ]}
        onDidDismiss={() => setIsOpen(false)}
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
