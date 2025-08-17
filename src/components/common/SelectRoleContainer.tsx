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
  IonItem,
  IonLabel,
  IonList,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { arrowForwardCircleOutline, clipboardOutline } from "ionicons/icons";
import { useEffect } from "react";

import type { TUser } from "../../models/user/userModel";
import { UserRoles } from "../../utils/enums";
import FallbackError from "./FallbackError/FallbackError";

const ROLE_CONFIG = {
  [UserRoles.SYSTEM_ADMINISTRATOR]: {
    label: "Amministratore di sistema",
    chips: ["Gestisce coaches", "Gestisce orari", "Gestisce assegnazioni"],
    route: "/systemAdministrator",
  },
  [UserRoles.ADMINISTRATOR]: {
    label: "Amministratore",
    chips: ["Verifica prenotazioni"],
    route: "/administrator",
  },
  [UserRoles.USER]: {
    label: "Utente",
    chips: ["Prenota lezioni"],
    route: "/user",
  },
};

const SelectRoleContainer = () => {
  const { user } = useAuth0();
  const router = useIonRouter();

  const extendedUser = user as TUser;
  const roles: UserRoles[] = extendedUser.app_metadata.roles;

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

  if (roles.length === 0)
    return <FallbackError statusCode={403} message="Nessun ruolo associato" />;

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
      <IonCard>
        <IonList inset={true}>
          {roles?.map((role: UserRoles, index) => {
            const { label, chips } =
              ROLE_CONFIG[role] || ROLE_CONFIG[UserRoles.USER];

            return (
              <IonItem key={index}>
                <IonAvatar aria-hidden="true" slot="start">
                  <img alt="Coach's avatar" src="/assets/roles/id-card.png" />
                </IonAvatar>
                <IonLabel>
                  <h1>{label}</h1>
                  {chips.map((chip, i) => (
                    <IonChip key={i}>
                      <IonLabel>{chip}</IonLabel>
                      <IonIcon icon={clipboardOutline} />
                    </IonChip>
                  ))}
                  <IonButton
                    size="small"
                    shape="round"
                    data-testid="select-role"
                    onClick={() => handleSelectRole(role)}
                  >
                    <IonIcon slot="start" icon={arrowForwardCircleOutline} />
                    Continua
                  </IonButton>
                </IonLabel>
              </IonItem>
            );
          })}
        </IonList>
      </IonCard>
    </>
  );
};

export default SelectRoleContainer;
