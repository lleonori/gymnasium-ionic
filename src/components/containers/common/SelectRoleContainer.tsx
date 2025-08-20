import { useAuth0 } from "@auth0/auth0-react";
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { clipboardOutline } from "ionicons/icons";
import { useEffect } from "react";

import type { TUser } from "../../../models/user/userModel";
import { UserRoles } from "../../../utils/enums";
import FallbackError from "../../common/FallbackError/FallbackError";

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
          <ul>
            <li>
              <IonText>
                Amministratore di sistema gestisce coaches, orari e assegnazioni
              </IonText>
            </li>
            <li>
              <IonText>Amministratore verifica prenotazioni</IonText>
            </li>
            <li>
              <IonText>Utente prenota lezioni</IonText>
            </li>
          </ul>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonList inset={true}>
          {roles?.map((role: UserRoles, index) => {
            const { label } = ROLE_CONFIG[role];

            return (
              <IonItem
                key={index}
                button={true}
                onClick={() => handleSelectRole(role)}
              >
                <IonAvatar aria-hidden="true" slot="start">
                  <img alt="Coach's avatar" src="/assets/roles/id-card.png" />
                </IonAvatar>
                <IonLabel>
                  <h1>{label}</h1>
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
