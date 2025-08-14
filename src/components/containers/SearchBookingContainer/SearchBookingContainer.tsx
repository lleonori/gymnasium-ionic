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
  IonText,
  IonToast,
  SelectChangeEventDetail,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import {
  calendarNumberOutline,
  filterOutline,
  searchOutline,
  timeOutline,
} from "ionicons/icons";
import { useState } from "react";

import { getBookings } from "../../../api/booking/bookingApi";
import { getCalendar } from "../../../api/calendar/calendarApi";
import { getTimetables } from "../../../api/timetable/timetableApi";
import { TBooking, TFilterBooking } from "../../../models/booking/bookingModel";
import { TSortBy } from "../../../models/sort/sortModel";
import {
  TFilterTimetable,
  TTimetable,
} from "../../../models/timetable/timetableModel";
import { Colors } from "../../../utils/enums";
import {
  formatDateToDDMMYYYY,
  formatTime,
  getRandomImage,
} from "../../../utils/functions";
import FallbackError from "../..//common/FallbackError/FallbackError";
import Spinner from "../../common/Spinner/Spinner";
import "./SearchBookingContainer.css";

const SearchBookingContainer = () => {
  // booking filter
  const [filterBooking, setFilterBooking] = useState<
    TFilterBooking | undefined
  >();
  // timetable sorting
  const [timetableSort] = useState<TSortBy<TTimetable>>({
    sortBy: "startHour",
    orderBy: "asc",
  });
  // timetable filter
  const [filterTimetable, setFilterTimetable] = useState<
    TFilterTimetable | undefined
  >();
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
    queryFn: () => getBookings(filterBooking),
    queryKey: ["bookings", filterBooking],
    enabled: false,
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
    queryFn: () => getTimetables(filterTimetable, timetableSort),
    queryKey: ["timetables", filterBooking?.day],
    enabled: !!filterBooking?.day,
  });

  const onFilterChange = (
    event: CustomEvent<SelectChangeEventDetail>,
    field: keyof TFilterBooking
  ) => {
    const value = event.detail.value as TFilterBooking[keyof TFilterBooking];

    setFilterBooking((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Only try to get weekdayId if the field is "day" and value is a string (date)
    if (field === "day" && typeof value === "string") {
      const weekdayId = new Date(value).getDay();
      setFilterTimetable({ weekdayId });
    }
  };

  const handleFetchBookings = () => {
    if (filterBooking?.day && filterBooking?.timetableId) {
      void refetchBookings();
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
    return <FallbackError />;
  }

  return (
    <>
      {/* Presentational Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Scopri chi si allena oggi!</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon icon={calendarNumberOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText>
            Tieni sotto controllo le prenotazioni dei tuoi allenamenti con
            semplicità:
          </IonText>
          <ul>
            <li>
              <IonText>
                Seleziona un giorno e un orario per visualizzare i partecipanti
              </IonText>
            </li>
          </ul>
        </IonCardContent>
      </IonCard>
      {/* Filters Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Filtra le prenotazioni</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon icon={filterOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          {/* Day Field */}
          <IonSelect
            cancelText="Annulla"
            value={filterBooking?.day}
            label="Giorno"
            labelPlacement="floating"
            onIonChange={(e) => onFilterChange(e, "day")}
          >
            {calendar?.today && (
              <IonSelectOption value={calendar.today}>
                {formatDateToDDMMYYYY(calendar.today)}
              </IonSelectOption>
            )}
            {calendar?.tomorrow && (
              <IonSelectOption value={calendar.tomorrow}>
                {formatDateToDDMMYYYY(calendar.tomorrow)}
              </IonSelectOption>
            )}
          </IonSelect>
          {/* Hour Field */}
          <IonSelect
            cancelText="Annulla"
            value={filterBooking?.timetableId}
            label="Orario"
            labelPlacement="floating"
            onIonChange={(e) => onFilterChange(e, "timetableId")}
          >
            {timetables?.data.map((timetable: TTimetable) => (
              <IonSelectOption key={timetable.id} value={timetable.id}>
                {`${formatTime(timetable.startHour)} - ${formatTime(timetable.endHour)}`}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonButton
            size="small"
            shape="round"
            data-testid="search-bookings"
            onClick={handleFetchBookings}
          >
            <IonIcon slot="start" icon={searchOutline}></IonIcon>
            Cerca
          </IonButton>
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
                  <img alt="User's avatar" src={getRandomImage()} />
                </IonAvatar>
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonChip>
                <IonLabel>{booking.day.toString()}</IonLabel>
                <IonIcon icon={calendarNumberOutline}></IonIcon>
              </IonChip>
              <IonChip>
                <IonLabel>
                  {`${formatTime(booking.startHour)} - ${formatTime(booking.endHour)}`}
                </IonLabel>
                <IonIcon icon={timeOutline}></IonIcon>
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
