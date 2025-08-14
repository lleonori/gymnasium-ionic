import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { SubmitHandler, useForm } from "react-hook-form";

import { TModalRole } from "../../../../models/modal/modalModel";
import {
  TCreateTimetable,
  TTimetable,
} from "../../../../models/timetable/timetableModel";
import { Colors } from "../../../../utils/enums";

interface IBaseProps {
  dismiss: (
    data: TCreateTimetable | TTimetable | null,
    role: TModalRole
  ) => void;
}

interface ICreateTimetableProps extends IBaseProps {
  mode: "create";
}

interface IUpdateTimetableProps extends IBaseProps {
  mode: "update";
  currentTimetable: TTimetable;
}

type HandlerTimetableProps = ICreateTimetableProps | IUpdateTimetableProps;

interface ITimetableForm {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

const HandlerTimetable = (props: HandlerTimetableProps) => {
  const isUpdateMode = props.mode === "update";
  const currentTimetable = isUpdateMode ? props.currentTimetable : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<ITimetableForm>({
    defaultValues: isUpdateMode
      ? {
          startHour: currentTimetable?.startHour.split(":")[0],
          startMinute: currentTimetable?.startHour.split(":")[1],
          endHour: currentTimetable?.endHour.split(":")[0],
          endMinute: currentTimetable?.endHour.split(":")[1],
        }
      : {},
  });

  const onSubmit: SubmitHandler<ITimetableForm> = (data) => {
    const formattedData: TCreateTimetable | TTimetable = {
      startHour: `${data.startHour}:${data.startMinute}:00Z`,
      endHour: `${data.endHour}:${data.endMinute}:00Z`,
    };

    const result = isUpdateMode
      ? { ...currentTimetable, ...formattedData }
      : formattedData;

    props.dismiss(result, "confirm");
  };

  return (
    <form onSubmit={void handleSubmit(onSubmit)}>
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
              {isUpdateMode ? "Modifica Orario" : "Nuovo Orario"}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton
                data-testid="create-update-timetable"
                type="submit"
                strong={true}
              >
                {isUpdateMode ? "Modifica" : "Crea"}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList inset={true}>
            <IonItem>
              <IonSelect
                cancelText="Annulla"
                labelPlacement="floating"
                {...register("startHour", {
                  required: true,
                })}
                onIonChange={() => {
                  clearErrors("startHour");
                }}
              >
                <div slot="label">
                  Ora Inizio
                  {errors.startHour && (
                    <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                  )}
                </div>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, "0");
                  return (
                    <IonSelectOption key={hour} value={hour}>
                      {hour}
                    </IonSelectOption>
                  );
                })}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonSelect
                cancelText="Annulla"
                labelPlacement="floating"
                {...register("startMinute", {
                  required: true,
                })}
                onIonChange={() => {
                  clearErrors("startMinute");
                }}
              >
                <div slot="label">
                  Minuti Inizio
                  {errors.startMinute && (
                    <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                  )}
                </div>
                <IonSelectOption value="00">00</IonSelectOption>
                <IonSelectOption value="15">15</IonSelectOption>
                <IonSelectOption value="30">30</IonSelectOption>
                <IonSelectOption value="45">45</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>
          <IonList inset={true}>
            <IonItem>
              <IonSelect
                cancelText="Annulla"
                labelPlacement="floating"
                {...register("endHour", {
                  required: true,
                })}
                onIonChange={() => {
                  clearErrors("endHour");
                }}
              >
                <div slot="label">
                  Ora Fine
                  {errors.endHour && (
                    <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                  )}
                </div>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, "0");
                  return (
                    <IonSelectOption key={hour} value={hour}>
                      {hour}
                    </IonSelectOption>
                  );
                })}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonSelect
                cancelText="Annulla"
                labelPlacement="floating"
                {...register("endMinute", {
                  required: true,
                })}
                onIonChange={() => {
                  clearErrors("endMinute");
                }}
              >
                <div slot="label">
                  Minuti Fine
                  {errors.endMinute && (
                    <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                  )}
                </div>
                <IonSelectOption value="00">00</IonSelectOption>
                <IonSelectOption value="15">15</IonSelectOption>
                <IonSelectOption value="30">30</IonSelectOption>
                <IonSelectOption value="45">45</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    </form>
  );
};

export default HandlerTimetable;
