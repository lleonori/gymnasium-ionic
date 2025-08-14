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

const ROLE_CONFIG = {
  [UserRoles.SYSTEM_ADMINISTRATOR]: {
    label: "Amministratore di sistema",
    chips: [
      "Può gestire i coaches",
      "Può gestire gli orari",
      "Può gestire l'assegnazione di giorni e orari",
    ],
    route: "/systemAdministrator",
  },
  [UserRoles.ADMINISTRATOR]: {
    label: "Amministratore",
    chips: ["Può verificare le prenotazioni"],
    route: "/administrator",
  },
  [UserRoles.USER]: {
    label: "Utente",
    chips: ["Può prenotare una lezione"],
    route: "/user",
  },
};

const SelectRoleContainer = () => {
  const { user } = useAuth0();
  const router = useIonRouter();

  const extendedUser = user as TUser;
  const roles: UserRoles[] = extendedUser?.app_metadata?.roles || [];

  const handleSelectRole = (role: UserRoles) => {
    const config = ROLE_CONFIG[role] || ROLE_CONFIG[UserRoles.USER];
    router.push(config.route, "root");
  };

  useEffect(() => {
    if (roles.length === 1) {
      const [role] = roles;
      handleSelectRole(role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles]);

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Con quale ruolo vuoi accedere?</IonCardTitle>
          <IonCardSubtitle>
            <IonIcon icon={clipboardOutline} />
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText>
            Seleziona il ruolo con cui vuoi continuare e… pronti a partire!
          </IonText>
        </IonCardContent>
      </IonCard>
      {roles.map((role, index) => {
        const { label, chips } =
          ROLE_CONFIG[role] || ROLE_CONFIG[UserRoles.USER];
        return (
          <IonCard key={index}>
            <IonCardHeader>
              <IonCardTitle>{label}</IonCardTitle>
              <IonCardSubtitle>
                <IonAvatar>
                  <img alt="Role's avatar" src="/assets/roles/id-card.png" />
                </IonAvatar>
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              {chips.map((chip, i) => (
                <IonChip key={i}>
                  <IonLabel>{chip}</IonLabel>
                  <IonIcon icon={clipboardOutline} />
                </IonChip>
              ))}
              <br />
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
        );
      })}
    </>
  );
};

export default SelectRoleContainer;
