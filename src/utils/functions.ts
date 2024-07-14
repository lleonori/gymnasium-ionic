const imagePaths = [
  "/assets/avatar-user/balls.png",
  "/assets/avatar-user/barbell.png",
  "/assets/avatar-user/bottle.png",
  "/assets/avatar-user/elastic-band.png",
  "/assets/avatar-user/kettlebell.png",
  "/assets/avatar-user/mat.png",
  "/assets/avatar-user/rings.png",
  "/assets/avatar-user/roller.png",
  "/assets/avatar-user/weight.png",
];

export const getRandomImage = (): string => {
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
};

export const formatDate = (date: Date): string => {
  // Get the year, month, and day from the Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  // Combine them into the desired format
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};
