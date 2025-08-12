const imagePaths = [
  "/assets/avatar/arm.png",
  "/assets/avatar/balance.png",
  "/assets/avatar/barbell.png",
  "/assets/avatar/bench-press.png",
  "/assets/avatar/bottle.png",
  "/assets/avatar/calories.png",
  "/assets/avatar/chocolate-bar.png",
  "/assets/avatar/dumbbell-health.png",
  "/assets/avatar/dumbbell-kettlebell.png",
  "/assets/avatar/dumbbell.png",
  "/assets/avatar/dumbbells.png",
  "/assets/avatar/elastic-band.png",
  "/assets/avatar/energy-bar.png",
  "/assets/avatar/fitness-watch.png",
  "/assets/avatar/fitness.png",
  "/assets/avatar/gym.png",
  "/assets/avatar/gymnast.png",
  "/assets/avatar/kettlebell-red.png",
  "/assets/avatar/kettlebell.png",
  "/assets/avatar/mat.png",
  "/assets/avatar/measuring-spoon.png",
  "/assets/avatar/muscle.png",
  "/assets/avatar/pilates.png",
  "/assets/avatar/power.png",
  "/assets/avatar/proteins.png",
  "/assets/avatar/punch.png",
  "/assets/avatar/rings.png",
  "/assets/avatar/scales.png",
  "/assets/avatar/scoop.png",
  "/assets/avatar/shoe.png",
  "/assets/avatar/sit-up.png",
  "/assets/avatar/smartwatch.png",
  "/assets/avatar/sport-bag.png",
  "/assets/avatar/sport-bag-yellow.png",
  "/assets/avatar/sports-pants.png",
  "/assets/avatar/step.png",
  "/assets/avatar/strong.png",
  "/assets/avatar/t-shirt.png",
  "/assets/avatar/timer.png",
  "/assets/avatar/training.png",
  "/assets/avatar/treadmill.png",
  "/assets/avatar/tshirt.png",
  "/assets/avatar/weight-black.png",
  "/assets/avatar/weight-lifting.png",
  "/assets/avatar/weight-plates.png",
  "/assets/avatar/weight.png",
];

export const getRandomImage = (): string => {
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
};

export const generateImages = <T extends { id: number }>(
  data: T[],
): Record<string, string> => {
  const map: Record<string, string> = {};
  data.forEach((d) => {
    map[d.id] = getRandomImage();
  });
  return map;
};

export const formatDateToDDMMYYYY = (date: string | undefined): string => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

export const formatTime = (time: string) => {
  // time format in input is HH:mm:ss and needs to format in HH:mm
  const [hours, minutes] = time.split(":");
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
};

// Esempio: { weekdayId: 2 } => "weekdayId=2"
export function buildQueryStringFilters(
  filters: Record<string, string | number | boolean | undefined | null>,
): string {
  return Object.entries(filters)
    .filter(([value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");
}

// Esempio: { sortBy: "weekdayId", orderBy: "asc" } => "weekdayId.asc"
export function buildQueryStringSort<T>(sort: {
  sortBy: keyof T;
  orderBy: "asc" | "desc";
}): string {
  return `${encodeURIComponent(String(sort.sortBy))}.${sort.orderBy}`;
}
