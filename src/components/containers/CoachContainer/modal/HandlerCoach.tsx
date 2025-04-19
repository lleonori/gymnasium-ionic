import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TCoach, TCreateCoach } from "../../../../models/coach/coachModel";
import { TModalRole } from "../../../../models/modal/modalModel";
import { Colors } from "../../../../utils/enums";

interface BaseProps {
  dismiss: (data: TCreateCoach | TCoach | null, role: TModalRole) => void;
}

interface CreateCoachProps extends BaseProps {
  mode: "create";
}

interface UpdateCoachProps extends BaseProps {
  mode: "update";
  currentCoach: TCoach;
}

type HandlerCoachProps = CreateCoachProps | UpdateCoachProps;

const HandlerCoach = (props: HandlerCoachProps) => {
  const isUpdateMode = props.mode === "update";
  const currentCoach = isUpdateMode ? props.currentCoach : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<TCreateCoach>({
    defaultValues: isUpdateMode
      ? {
          name: currentCoach?.name,
          surname: currentCoach?.surname,
          notes: currentCoach?.notes,
          image: currentCoach?.image,
        }
      : {},
  });

  const onSubmit: SubmitHandler<TCreateCoach | TCoach> = (data) => {
    if (isUpdateMode) {
      const updatedCoach = {
        ...currentCoach,
        ...data,
      };
      props.dismiss(updatedCoach, "confirm");
    } else {
      props.dismiss(data, "confirm");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                color={Colors.MEDIUM}
                onClick={() => props.dismiss(null, "cancel")}
              >
                Annulla
              </IonButton>
            </IonButtons>
            <IonTitle>
              {isUpdateMode ? "Modifica Coach" : "Nuovo Coach"}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton type="submit" strong={true}>
                {isUpdateMode ? "Modifica" : "Crea"}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList inset={true}>
            <IonItem>
              <IonInput
                {...register("name", {
                  required: true,
                })}
                labelPlacement="floating"
                placeholder="Inserisci il nome"
                onIonChange={() => clearErrors("name")}
              >
                <div slot="label">
                  Nome
                  {errors.name && (
                    <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                  )}
                </div>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                {...register("surname", {
                  required: true,
                })}
                labelPlacement="floating"
                placeholder="Inserisci il cognome"
                onIonChange={() => clearErrors("surname")}
              >
                <div slot="label">
                  Cognome
                  {errors.surname && (
                    <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                  )}
                </div>
              </IonInput>
            </IonItem>
          </IonList>
          <IonList inset={true}>
            <IonItem>
              <IonTextarea
                {...register("notes", {
                  required: true,
                })}
                label-placement="floating"
                rows={15}
                placeholder="Inserisci le note es. specializzazioni, esperienze, lauree, ecc..."
                onIonChange={() => clearErrors("notes")}
              >
                <div slot="label">
                  Note
                  {errors.notes && (
                    <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                  )}
                </div>
              </IonTextarea>
            </IonItem>
          </IonList>
          <IonList inset={true}>
            <IonItem>
              <IonInput
                {...register("image", {
                  required: true,
                })}
                labelPlacement="floating"
                placeholder="Inserisci l'url dell'immagine"
                onIonChange={() => clearErrors("image")}
              >
                <div slot="label">
                  Immagine
                  {errors.image && (
                    <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                  )}
                </div>
              </IonInput>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    </form>
  );
};

export default HandlerCoach;
