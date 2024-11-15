import {
  IonAvatar,
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
  SelectChangeEventDetail,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { barbellOutline, filterOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { getAllBookings } from "../api/booking/bookingApi";
import { getCalendar } from "../api/calendar/calendarApi";
import { fetchTimetables } from "../api/timetable/timetableApi";
import { TBooking, TFilterBooking } from "../models/booking/bookingModel";
import { TTimetable } from "../models/timetable/timetableModel";
import { formatDate, getRandomImage } from "../utils/functions";
import Error from "./Error";
import Spinner from "./Spinner";

const AppAdminContainer = () => {
  // get user avatar
  const [images, setImages] = useState<{ [key: string]: string }>({});
  // booking filter
  const [filterBooking, setFilterBooking] = useState<TFilterBooking>({
    day: formatDate(new Date()),
    hour: "",
  });

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    error: bookingsError,
    isFetching: isBookingsFetching,
  } = useQuery({
    queryFn: () => getAllBookings(filterBooking),
    queryKey: ["bookings", filterBooking],
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
    queryFn: () => fetchTimetables(),
    queryKey: ["timetables"],
  });

  const onFilterChange =
    (field: keyof TFilterBooking) =>
    (event: CustomEvent<SelectChangeEventDetail>) => {
      debugger;
      const value = event.detail.value;
      setFilterBooking((prev: TFilterBooking) => ({
        ...prev,
        [field]: value,
      }));
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
                {calendar.today.toString()}
              </IonSelectOption>
            )}
            {calendar?.tomorrow && (
              <IonSelectOption value={calendar.tomorrow}>
                {calendar.tomorrow.toString()}
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
                {timetable.hour}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonCardContent>
      </IonCard>
      {/* Booking Card */}
      {bookings?.data.map((booking: TBooking) => (
        <IonCard key={booking.id}>
          <IonCardHeader>
            <IonCardTitle>{booking.mail}</IonCardTitle>
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
              <IonLabel>{booking.hour}</IonLabel>
            </IonChip>
          </IonCardContent>
        </IonCard>
      ))}
    </>
  );
};

export default AppAdminContainer;
