
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg } from '@ionic/react';
import './ExploreContainer.css';

interface ContainerProps {
  name: string;
}

const HomeContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <>
      <IonImg
        src="/assets/Gymnasium_completo.svg"
        alt="logo"
      ></IonImg>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Benvenuto</IonCardTitle>
          <IonCardSubtitle color="warning">Lorenzo Leonori</IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>Tramite questa app potrai prenotare la tua lezione.</IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Regole di prenotazione</IonCardTitle>
          <IonCardSubtitle color="warning">Lorenzo Leonori</IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>E' possibile prenotare nella giornata odierna o di domani nelle fasce orarie disponibili.</IonCardContent>
      </IonCard>
    </>
  );
};

export default HomeContainer;
