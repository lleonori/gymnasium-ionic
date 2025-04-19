import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TModalRole } from "../../../../models/modal/modalModel";
import {
  TCreateTimetable,
  TTimetable,
} from "../../../../models/timetable/timetableModel";
import { Colors } from "../../../../utils/enums";

interface BaseProps {
  dismiss: (
    data: TCreateTimetable | TTimetable | null,
    role: TModalRole
  ) => void;
}

interface CreateTimetableProps extends BaseProps {
  mode: "create";
}

interface UpdateTimetableProps extends BaseProps {
  mode: "update";
  currentTimetable: TTimetable;
}

type HandlerTimetableProps = CreateTimetableProps | UpdateTimetableProps;

const HandlerTimetable = (props: HandlerTimetableProps) => {
  const isUpdateMode = props.mode === "update";
  const currentTimetable = isUpdateMode ? props.currentTimetable : null;

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<TCreateTimetable>({
    defaultValues: isUpdateMode
      ? {
          hour: currentTimetable?.hour,
          isValidOnWeekend: currentTimetable?.isValidOnWeekend,
        }
      : {},
  });

  const onSubmit: SubmitHandler<TCreateTimetable | TTimetable> = (data) => {
    const formatTime = (time: string) => {
      return new Date(time).toISOString().replace(/^.*T(.*)\.\d+Z$/, "$1Z");
    };

    if (isUpdateMode) {
      const updatedTimetable = {
        ...currentTimetable,
        ...data,
        hour: formatTime(data.hour as string),
      };
      props.dismiss(updatedTimetable, "confirm");
    } else {
      const formatTimetable = {
        ...data,
        hour: formatTime(data.hour as string),
      };
      props.dismiss(formatTimetable, "confirm");
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
              {isUpdateMode ? "Modifica Orario" : "Nuovo Orario"}
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
              <IonLabel>
                Orario
                {errors.hour && (
                  <IonText color={Colors.DANGER}>(Obbligatorio)</IonText>
                )}
              </IonLabel>
              <Controller
                name="hour"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <IonDatetime
                    presentation="time"
                    value={field.value}
                    onIonChange={(e) => {
                      field.onChange(e.detail.value);
                      clearErrors("hour");
                    }}
                  />
                )}
              />
            </IonItem>
          </IonList>
          <IonList inset={true}>
            <IonItem>
              <Controller
                name="isValidOnWeekend"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <IonToggle
                    labelPlacement="start"
                    checked={field.value}
                    onIonChange={(e) => field.onChange(e.detail.checked)}
                  >
                    Valido nel weekend
                  </IonToggle>
                )}
              />
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    </form>
  );
};

export default HandlerTimetable;
