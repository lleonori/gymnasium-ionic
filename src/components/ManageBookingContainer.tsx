import { IonCol, IonGrid, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonRow } from '@ionic/react';
import './BookingContainer.css';

interface ContainerProps {
  name: string;
}

const BookingContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonList>
            <IonItemSliding>
              <IonItem>
                <IonLabel>
                  <IonLabel>
                    <h1>Lorenzo Leonori</h1>
                    <p>Giorno 21-03-2024</p>
                    <p>Orario 19:00</p>
                  </IonLabel>
                </IonLabel>
              </IonItem>
              <IonItemOptions>
                <IonItemOption color="danger">Elimina</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
            <IonItemSliding>
              <IonItem>
                <IonLabel>
                  <h1>Lorenzo Leonori</h1>
                  <p>Giorno 22-03-2024</p>
                  <p>Orario 17:00</p>
                </IonLabel>
              </IonItem>
              <IonItemOptions>
                <IonItemOption color="danger">Elimina</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          </IonList>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default BookingContainer;
