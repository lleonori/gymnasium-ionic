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
  hour: string;
  minute: string;
  isValidOnWeekend: boolean;
}

const HandlerTimetable = (props: HandlerTimetableProps) => {
  const isUpdateMode = props.mode === "update";
  const currentTimetable = isUpdateMode ? props.currentTimetable : null;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<ITimetableForm>({
    defaultValues: isUpdateMode
      ? {
          hour: currentTimetable?.hour.split(":")[0],
          minute: currentTimetable?.hour.split(":")[1],
          isValidOnWeekend: currentTimetable?.isValidOnWeekend,
        }
      : {},
  });

  const onSubmit: SubmitHandler<ITimetableForm> = (data) => {
    const formattedData: TCreateTimetable | TTimetable = {
      hour: `${data.hour}:${data.minute}:00Z`,
      isValidOnWeekend: data.isValidOnWeekend,
    };

    const result = isUpdateMode
      ? { ...currentTimetable, ...formattedData }
      : formattedData;

    props.dismiss(result, "confirm");
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
              <IonSelect
                labelPlacement="floating"
                {...register("hour", {
                  required: true,
                })}
                onIonChange={() => {
                  clearErrors("hour");
                }}
              >
                <div slot="label">
                  Ora
                  {errors.hour && (
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
                labelPlacement="floating"
                {...register("minute", {
                  required: true,
                })}
                onIonChange={() => {
                  clearErrors("minute");
                }}
              >
                <div slot="label">
                  Minuti
                  {errors.minute && (
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
