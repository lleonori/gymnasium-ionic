import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonPage,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Colors } from "../../utils/enums";
import "./Login.css";
import { logIn, logInOutline } from "ionicons/icons";

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  const swiperRef = useRef<SwiperRef | null>(null);

  const login = async () => {
    await loginWithRedirect({
      async openUrl(url) {
        await Browser.open({
          url,
          windowName: "_self",
        });
      },
    });
  };

  const handleSkip = () => {
    swiperRef.current?.swiper?.slideTo(slides.length - 1);
  };

  const slides = [
    {
      image: "/assets/onboarding/treadmill.png",
      alt: "Plank exercise",
      title: "Attività motoria preventiva e adattata",
      description: "Mantieni, migliora e recupera la funzionalità motoria",
    },
    {
      image: "/assets/onboarding/dumbbell.png",
      alt: "Squats exercise",
      title: "Ricomposizione corporea",
      description:
        "Migliora e monitora la tua forma con un allenamento personalizzato",
    },
    {
      image: "/assets/onboarding/bench-press.png",
      alt: "Bench press exercise",
      title: "Strength coaching",
      description: "La prima squadra di Powerlifting sul territorio",
      showButton: true,
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton
            data-testid="skip-button"
            slot="end"
            fill="clear"
            color={Colors.MEDIUM}
            onClick={handleSkip}
          >
            Salta
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="onboarding-wrapper">
        <Swiper
          ref={swiperRef}
          pagination={true}
          modules={[Pagination]}
          className="onboarding-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide className="onboarding-slide" key={index}>
              <div className="circle-image">
                <IonImg src={slide.image} alt={slide.alt} />
              </div>
              <IonText className="slide-title">{slide.title}</IonText>
              <IonText className="slide-desc">{slide.description}</IonText>
              <IonImg className="logo" alt="Gymnasium logo" />
              {slide.showButton && (
                <IonButton
                  color={Colors.PRIMARY}
                  shape="round"
                  onClick={login}
                  data-testid="login-button"
                >
                  <IonIcon slot="start" icon={logInOutline}></IonIcon>
                  Inizia ora
                </IonButton>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Login;
