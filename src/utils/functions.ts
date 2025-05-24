const imagePaths = [
  "/assets/avatar/barbell.png",
  "/assets/avatar/bottle.png",
  "/assets/avatar/dumbbell.png",
  "/assets/avatar/elastic-band.png",
  "/assets/avatar/kettlebell.png",
  "/assets/avatar/mat.png",
  "/assets/avatar/proteins.png",
  "/assets/avatar/rings.png",
  "/assets/avatar/sport-bag.png",
  "/assets/avatar/step.png",
  "/assets/avatar/weight-lifting.png",
  "/assets/avatar/weight.png",
];

export const getRandomImage = (): string => {
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
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
