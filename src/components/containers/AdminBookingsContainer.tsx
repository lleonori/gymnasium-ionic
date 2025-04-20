import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToast,
  SelectChangeEventDetail,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import {
  arrowForwardCircleOutline,
  barbellOutline,
  filterOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { getAllBookings } from "../../api/booking/bookingApi";
import { getCalendar } from "../../api/calendar/calendarApi";
import { getTimetablesByDay } from "../../api/timetable/timetableApi";
import { TBooking, TFilterBooking } from "../../models/booking/bookingModel";
import { TTimetable } from "../../models/timetable/timetableModel";
import { Colors } from "../../utils/enums";
import { formatDate, formatTime, getRandomImage } from "../../utils/functions";
import Error from "../common/Error";
import Spinner from "../common/Spinner/Spinner";

const AdminBookingsContainer = () => {
  // get user avatar
  const [images, setImages] = useState<{ [key: string]: string }>({});
  // booking filter
  const [filterBooking, setFilterBooking] = useState<TFilterBooking>({
    day: formatDate(new Date()),
    hour: "",
  });
  // state for Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  // state for Toast message
  const [toastMessage, setToastMessage] = useState<string>("");
  // state for Toast message
  const [toastColor, setToastColor] = useState<string>("");

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    error: bookingsError,
    isFetching: isBookingsFetching,
    refetch: refetchBookings,
  } = useQuery({
    queryFn: () => getAllBookings(filterBooking),
    queryKey: ["bookings"],
    enabled: false, // La query non parte automaticamente
  });

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
    data: timetables,
    isLoading: isTimetablesLoading,
    error: timetablesError,
    isFetching: isTimetablesFetching,
  } = useQuery({
    queryFn: () => getTimetablesByDay(filterBooking.day!),
    queryKey: ["timetables", filterBooking.day],
    // query enabled only if filterBooking.day is set
    enabled: !!filterBooking.day,
  });

  const onFilterChange =
    (field: keyof TFilterBooking) =>
    (event: CustomEvent<SelectChangeEventDetail>) => {
      const value = event.detail.value;
      setFilterBooking((prev: TFilterBooking) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleFetchBookings = () => {
    if (filterBooking.day && filterBooking.hour) {
      refetchBookings();
    } else {
      showToastWithMessage(
        "Seleziona sia il giorno che l'orario prima di cercare.",
        Colors.WARNING
      );
    }
  };

  const showToastWithMessage = (message: string, color: string) => {
    setToastColor(color);
    setToastMessage(message);
    setShowToast(true);
  };

  useEffect(() => {
    if (bookings) {
      const imagesMap: { [key: string]: string } = {};

      bookings.data.forEach((booking: TBooking) => {
        imagesMap[booking.id] = getRandomImage();
      });

      setImages(imagesMap);
    }
  }, [bookings]);

  if (isCalendarLoading && isBookingsLoading && isTimetablesLoading) {
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
          <IonCardTitle>
            Benvenuto <br />
          </IonCardTitle>
          <IonCardSubtitle>
            <IonIcon aria-hidden="true" icon={barbellOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Tramite questa app puoi verificare le prenotazioni effettuate. <br />
          <br />
          "I am. I can. I will. I do."
        </IonCardContent>
      </IonCard>
      {/* Filters Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            Filtri <br />
          </IonCardTitle>
          <IonCardSubtitle>
            <IonIcon aria-hidden="true" icon={filterOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          {/* Day Field */}
          <IonSelect
            value={filterBooking.day}
            label="Giorno"
            labelPlacement="floating"
            onIonChange={onFilterChange("day")}
          >
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
            value={filterBooking.hour} // Use filterBooking state directly
            label="Orario"
            labelPlacement="floating"
            onIonChange={onFilterChange("hour")} // Update filterBooking on change
          >
            {timetables?.data.map((timetable: TTimetable) => (
              <IonSelectOption key={timetable.id} value={timetable.hour}>
                {formatTime(timetable.hour)}
              </IonSelectOption>
            ))}
          </IonSelect>
          <div className="button-container">
            <IonButton type="button" size="small" onClick={handleFetchBookings}>
              <IonIcon
                slot="icon-only"
                icon={arrowForwardCircleOutline}
              ></IonIcon>
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>
      {/* Booking Card */}
      {bookings?.data.map((booking: TBooking) => (
        <IonCard key={booking.id}>
          <IonCardHeader>
            <IonCardTitle>
              {booking.fullname ? booking.fullname : booking.mail}
            </IonCardTitle>
            <IonCardSubtitle>
              <IonAvatar>
                <img alt="User's avatar" src={images[booking.id]} />
              </IonAvatar>
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonChip>
              <IonLabel>{booking.day.toString()}</IonLabel>
            </IonChip>
            <IonChip>
              <IonLabel>{formatTime(booking.hour)}</IonLabel>
            </IonChip>
          </IonCardContent>
        </IonCard>
      ))}
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

export default AdminBookingsContainer;
