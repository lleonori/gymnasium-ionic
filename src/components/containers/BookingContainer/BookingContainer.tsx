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
  calendarNumberOutline,
  checkmarkCircleOutline,
  timeOutline,
  trashBinOutline,
} from "ionicons/icons";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  deleteBooking,
  getBookings,
  saveBooking,
} from "../../../api/booking/bookingApi";
import { getCalendar } from "../../../api/calendar/calendarApi";
import { getTimetables } from "../../../api/timetable/timetableApi";
import { TBooking, TCreateBooking } from "../../../models/booking/bookingModel";
import { TResponseError } from "../../../models/problems/responseErrorModel";
import { TSortBy } from "../../../models/sort/sortModel";
import {
  TFilterTimetable,
  TTimetable,
} from "../../../models/timetable/timetableModel";
import { TUser } from "../../../models/user/userModel";
import { Colors } from "../../../utils/enums";
import {
  formatDateToDDMMYYYY,
  formatTime,
  getRandomImage,
} from "../../../utils/functions";
import FallbackError from "../..//common/FallbackError/FallbackError";
import Spinner from "../../common/Spinner/Spinner";

const BookingContainer = () => {
  const { user } = useAuth0();
  const extendedUser = user as TUser;
  const queryClient = useQueryClient();

  // timetable sorting
  const [timetableSort] = useState<TSortBy<TTimetable>>({
    sortBy: "startHour",
    orderBy: "asc",
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
    queryFn: () =>
      getBookings({
        mail: extendedUser!.email,
        dateFrom: calendar!.today,
        dateTo: calendar!.tomorrow,
      }),
    queryKey: [
      "bookings",
      extendedUser?.email,
      calendar?.today,
      calendar?.tomorrow,
    ],
    enabled: !!extendedUser?.email && !!calendar?.today && !!calendar?.tomorrow,
  });

  const {
    data: timetables,
    isLoading: isTimetablesLoading,
    error: timetablesError,
    isFetching: isTimetablesFetching,
  } = useQuery({
    queryFn: () => getTimetables(filterTimetable, timetableSort),
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

  if (
    isCalendarFetching ||
    isBookingsFetching ||
    isTimetablesFetching ||
    isCalendarLoading ||
    isBookingsLoading ||
    isTimetablesLoading
  ) {
    return <Spinner />;
  }

  if (calendarError || bookingsError || timetablesError) {
    return <FallbackError />;
  }

  if (calendarError) {
    const apiError = calendarError as unknown as TResponseError;
    return <FallbackError statusCode={apiError.statusCode} />;
  }

  if (bookingsError) {
    const apiError = bookingsError as unknown as TResponseError;
    return <FallbackError statusCode={apiError.statusCode} />;
  }

  if (timetablesError) {
    const apiError = timetablesError as unknown as TResponseError;
    return <FallbackError statusCode={apiError.statusCode} />;
  }

  return (
    <>
      {/* Presentational Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>È il momento di prenotare!</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon icon={calendarNumberOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText>Gestisci le tue lezioni:</IonText>
          <ul>
            <li>
              <IonText>Prenota una lezione compilando il form</IonText>
            </li>
            <li>
              <IonText>Scorri verso sinistra per cancellarla</IonText>
            </li>
          </ul>
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
                {formatDateToDDMMYYYY(calendar?.today)}
              </IonSelectOption>
              <IonSelectOption value={calendar?.tomorrow}>
                {formatDateToDDMMYYYY(calendar?.tomorrow)}
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
            <IonButton
              type="submit"
              size="small"
              shape="round"
              data-testid="create-booking"
            >
              <IonIcon slot="start" icon={checkmarkCircleOutline}></IonIcon>
              Prenotati
            </IonButton>
          </form>
        </IonCardContent>
      </IonCard>
      {/* Your Booking Card */}
      {bookings && bookings.data.length > 0 && (
        <IonCard>
          <IonList inset={true}>
            {bookings.data.map((booking: TBooking) => (
              <IonItemSliding key={booking.id}>
                <IonItem button={true}>
                  <IonAvatar aria-hidden="true" slot="start">
                    <img alt="User's avatar" src={getRandomImage()} />
                  </IonAvatar>
                  <IonLabel>
                    <h1>{booking.fullname ?? booking.mail}</h1>
                    <IonChip>
                      <IonLabel>{formatDateToDDMMYYYY(booking.day)}</IonLabel>
                      <IonIcon icon={calendarNumberOutline}></IonIcon>
                    </IonChip>
                    <IonChip>
                      <IonLabel>
                        {formatTime(booking.startHour)}-
                        {formatTime(booking.endHour)}
                      </IonLabel>
                      <IonIcon icon={timeOutline}></IonIcon>
                    </IonChip>
                  </IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption
                    onClick={() => {
                      setCurrentBooking(booking);
                      handleOpenActionSheet();
                    }}
                    color={Colors.DANGER}
                  >
                    <IonIcon slot="icon-only" icon={trashBinOutline}></IonIcon>
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
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
