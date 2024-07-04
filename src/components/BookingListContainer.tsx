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
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { barbell } from "ionicons/icons";
import { useEffect, useState } from "react";
import { getAllBookings } from "../api/booking/bookingApi";
import { TBooking } from "../models/booking/bookingModel";
import { getRandomImage } from "../utils/functions";
import Spinner from "./Spinner";

const BookingListContainer: React.FC = () => {
  const [images, setImages] = useState<{ [key: string]: string }>({});

  const { data: bookings, isLoading: isLoading } = useQuery({
    queryFn: () => getAllBookings(),
    queryKey: ["bookings"],
  });

  useEffect(() => {
    if (bookings) {
      const imagesMap: { [key: string]: string } = {};

      bookings.data.forEach((booking: TBooking) => {
        imagesMap[booking.id] = getRandomImage();
      });

      setImages(imagesMap);
    }
  }, [bookings]);

  if (isLoading) {
    return <Spinner />;
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
            <IonIcon aria-hidden="true" icon={barbell} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Tramite questa app puoi verificare le prenotazioni effettuate. <br />
          <br />
          "I am. I can. I will. I do."
        </IonCardContent>
      </IonCard>

      {/* Coach Card */}
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

export default BookingListContainer;
