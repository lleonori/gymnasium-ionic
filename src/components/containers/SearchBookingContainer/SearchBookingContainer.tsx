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
import { barbellOutline, filterOutline, searchOutline } from "ionicons/icons";
import { useMemo, useState } from "react";
import { getBookings } from "../../../api/booking/bookingApi";
import { getCalendar } from "../../../api/calendar/calendarApi";
import { getTimetables } from "../../../api/timetable/timetableApi";
import { TBooking, TFilterBooking } from "../../../models/booking/bookingModel";
import {
  TFilterTimetable,
  TTimetable,
} from "../../../models/timetable/timetableModel";
import { Colors } from "../../../utils/enums";
import { formatTime, getRandomImage } from "../../../utils/functions";
import Error from "../../common/Error";
import Spinner from "../../common/Spinner/Spinner";
import "./SearchBookingContainer.css";

const SearchBookingContainer = () => {
  // booking filter
  const [filterBooking, setFilterBooking] = useState<TFilterBooking>({});
  // timetable filter
  const [filterTimetable, setFilterTimetable] = useState<TFilterTimetable>({});
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
    queryFn: () => getBookings(getNormalizedFilter(filterBooking)),
    queryKey: ["bookings", filterBooking],
    enabled: false,
  });

  const getNormalizedFilter = (filter: TFilterBooking): TFilterBooking => ({
    hour: `${filter?.hour}Z`,
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
    queryFn: () => getTimetables(filterTimetable),
    queryKey: ["timetables", filterBooking?.day],
    enabled: !!filterBooking?.day,
  });

  const onFilterChange = (
    event: CustomEvent<SelectChangeEventDetail>,
    field: keyof TFilterBooking
  ) => {
    const value = event.detail.value;

    setFilterBooking((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "day") {
      const weekdayId = new Date(value).getDay();
      setFilterTimetable({ weekdayId });
    }
  };

  const handleFetchBookings = () => {
    if (filterBooking?.day && filterBooking?.hour) {
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

  const imagesMap = useMemo(() => {
    if (!bookings) return {};

    const map: { [key: string]: string } = {};
    bookings.data.forEach((booking: TBooking) => {
      map[booking.id] = getRandomImage();
    });
    return map;
  }, [bookings]);

  if (
    isCalendarLoading ||
    isCalendarFetching ||
    isBookingsLoading ||
    isBookingsFetching ||
    isTimetablesLoading ||
    isTimetablesFetching
  ) {
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
            value={filterBooking?.day}
            label="Giorno"
            labelPlacement="floating"
            onIonChange={(e) => onFilterChange(e, "day")}
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
            value={filterBooking?.hour} // Use filterBooking state directly
            label="Orario"
            labelPlacement="floating"
            onIonChange={(e) => onFilterChange(e, "hour")}
          >
            {timetables?.data.map((timetable: TTimetable) => (
              <IonSelectOption key={timetable.id} value={timetable.hour}>
                {formatTime(timetable.hour)}
              </IonSelectOption>
            ))}
          </IonSelect>
          <div className="button-container">
            <IonButton type="button" size="small" onClick={handleFetchBookings}>
              <IonIcon slot="icon-only" icon={searchOutline}></IonIcon>
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>
      {/* Booking Card */}
      {bookings?.data.length === 0 ? (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Nessuna prenotazione</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Al momento non ci sono prenotazioni.</p>
          </IonCardContent>
        </IonCard>
      ) : (
        bookings?.data.map((booking: TBooking) => (
          <IonCard key={booking.id}>
            <IonCardHeader>
              <IonCardTitle>
                {booking.fullname ? booking.fullname : booking.mail}
              </IonCardTitle>
              <IonCardSubtitle>
                <IonAvatar>
                  <img alt="User's avatar" src={imagesMap[booking.id]} />
                </IonAvatar>
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonChip color={Colors.MEDIUM}>
                <IonLabel>{formatTime(booking.hour)}</IonLabel>
              </IonChip>
              <IonChip color={Colors.PRIMARY}>
                <IonLabel>{booking.day.toString()}</IonLabel>
              </IonChip>
            </IonCardContent>
          </IonCard>
        ))
      )}
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

export default SearchBookingContainer;
