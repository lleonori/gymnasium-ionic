const imagePaths = [
  "/assets/avatar/balls.png",
  "/assets/avatar/barbell.png",
  "/assets/avatar/bottle.png",
  "/assets/avatar/elastic-band.png",
  "/assets/avatar/kettlebell.png",
  "/assets/avatar/mat.png",
  "/assets/avatar/rings.png",
  "/assets/avatar/roller.png",
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
