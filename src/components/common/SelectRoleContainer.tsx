import { useAuth0 } from "@auth0/auth0-react";
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
  IonText,
  useIonRouter,
} from "@ionic/react";
import { arrowForwardCircleOutline, clipboardOutline } from "ionicons/icons";
import { useEffect } from "react";

import type { TUser } from "../../models/user/userModel";
import { UserRoles } from "../../utils/enums";

const SelectRoleContainer = () => {
  const { user } = useAuth0();
  const router = useIonRouter();

  const extendedUser = user as TUser;

  const handleSelectRole = (role: UserRoles) => {
    if (role === UserRoles.SYSTEM_ADMINISTRATOR) {
      router.push("/systemAdministrator", "root");
    } else if (role === UserRoles.ADMINISTRATOR) {
      router.push("/administrator", "root");
    } else {
      router.push("/user", "root");
    }
  };

  useEffect(() => {
    // Se c'è un solo ruolo, naviga automaticamente
    if (extendedUser?.app_metadata?.roles?.length === 1) {
      const [role] = extendedUser.app_metadata.roles;
      if (role === UserRoles.SYSTEM_ADMINISTRATOR) {
        router.push("/systemAdministrator", "root");
      } else if (role === UserRoles.ADMINISTRATOR) {
        router.push("/administrator", "root");
      } else {
        router.push("/user", "root");
      }
    }
  }, [extendedUser.app_metadata.roles, router]);

  return (
    <>
      {/* Role Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Con quale ruolo vuoi continuare?</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon icon={clipboardOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText>Scegli il ruolo.</IonText>
        </IonCardContent>
      </IonCard>
      {extendedUser?.app_metadata?.roles?.map((role, index) => (
        <IonCard key={index}>
          <IonCardHeader>
            <IonCardTitle>
              {role === UserRoles.SYSTEM_ADMINISTRATOR
                ? "Amministratore di sistema"
                : role === UserRoles.ADMINISTRATOR
                  ? "Amministratore"
                  : "Utente"}
            </IonCardTitle>
            <IonCardSubtitle>
              <IonAvatar>
                <img alt="Role's avatar" src="/assets/roles/id-card.png" />
              </IonAvatar>
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {role === UserRoles.SYSTEM_ADMINISTRATOR ? (
              <>
                <IonChip>
                  <IonLabel>Gestione coaches</IonLabel>
                  <IonIcon icon={clipboardOutline} />
                </IonChip>
                <IonChip>
                  <IonLabel>Gestione orari</IonLabel>
                  <IonIcon icon={clipboardOutline} />
                </IonChip>
                <IonChip>
                  <IonLabel>Gestione assegnazione giorni/orari</IonLabel>
                  <IonIcon icon={clipboardOutline} />
                </IonChip>
              </>
            ) : role === UserRoles.ADMINISTRATOR ? (
              <IonChip>
                <IonLabel>Verifica prenotazioni</IonLabel>
                <IonIcon icon={clipboardOutline} />
              </IonChip>
            ) : (
              <IonChip>
                <IonLabel>Prenotata lezione</IonLabel>
                <IonIcon icon={clipboardOutline} />
              </IonChip>
            )}
            <IonButton
              className="ion-margin-top"
              size="small"
              shape="round"
              data-testid="select-role"
              onClick={() => handleSelectRole(role)}
            >
              <IonIcon slot="start" icon={arrowForwardCircleOutline} />
              Continua
            </IonButton>
          </IonCardContent>
        </IonCard>
      ))}
    </>
  );
};

export default SelectRoleContainer;
