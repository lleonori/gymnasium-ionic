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
import { getTimetables } from "../../../api/timetable/timetableApi";
import {
  TBooking,
  TCreateBooking,
  TFilterBooking,
} from "../../../models/booking/bookingModel";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import {
  TFilterTimetable,
  TTimetable,
} from "../../../models/timetable/timetableModel";
import { TUser } from "../../../models/user/userModel";
import { Colors } from "../../../utils/enums";
import { formatTime, getRandomImage } from "../../../utils/functions";
import Error from "../../common/Error";
import Spinner from "../../common/Spinner/Spinner";

const BookingContainer = () => {
  const { user } = useAuth0();
  const extendedUser = user as TUser;
  const queryClient = useQueryClient();

  // booking filter
  const [filterBooking, _] = useState<TFilterBooking | undefined>({
    mail: extendedUser!.email,
  });
  // timetable filter
  const [filterTimetable, setFilterTimetable] = useState<
    TFilterTimetable | undefined
  >(undefined);
  // state for ActionSheet
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // state for selected Booking
  const [currentBooking, setCurrentBooking] = useState<TBooking | undefined>(
    undefined
  );
  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
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
    queryFn: () => getBookings(filterBooking),
    queryKey: ["bookings"],
  });

  const {
    data: timetables,
    isLoading: isTimetablesLoading,
    error: timetablesError,
    isFetching: isTimetablesFetching,
  } = useQuery({
    queryFn: () => getTimetables(filterTimetable),
    queryKey: ["timetables", filterTimetable],
    enabled: !!filterTimetable,
  });

  const onSubmit: SubmitHandler<TCreateBooking> = (data) => {
    const mail = extendedUser?.email;
    const fullname = extendedUser?.name;

    const formatData: TCreateBooking = {
      ...data,
      mail: mail!,
      fullname: fullname,
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
      setCurrentBooking(undefined);
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
            {/* Day Field */}
            <IonSelect
              cancelText="Annulla"
              labelPlacement="floating"
              {...register("day", {
                required: true,
              })}
              onIonChange={(e) => {
                const selectedDay = e.target.value;
                setValue("day", selectedDay);
                clearErrors("day");
                setFilterTimetable({
                  weekdayId: new Date(selectedDay).getDay(),
                });
              }}
            >
              <div slot="label">
                Giorno
                {errors.day && (
                  <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                )}
              </div>
              <IonSelectOption value={calendar?.today}>
                {calendar?.today}
              </IonSelectOption>
              <IonSelectOption value={calendar?.tomorrow}>
                {calendar?.tomorrow}
              </IonSelectOption>
            </IonSelect>
            {/* Hour Field */}
            <IonSelect
              cancelText="Annulla"
              labelPlacement="floating"
              {...register("timetableId", { required: true })}
              onIonChange={() => clearErrors("timetableId")}
            >
              <div slot="label">
                Orario
                {errors.timetableId && (
                  <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                )}
              </div>
              {timetables?.data.map((timetable: TTimetable) => (
                <IonSelectOption key={timetable.id} value={timetable.id}>
                  {`${formatTime(timetable.startHour)} - ${formatTime(timetable.endHour)}`}
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
                        <IonChip className="ion-margin-start">
                          <IonLabel>{booking.day.toString()}</IonLabel>
                        </IonChip>
                        <IonChip>
                          <IonLabel>
                            {`${formatTime(booking.startHour)} - ${formatTime(booking.endHour)}`}
                          </IonLabel>
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
