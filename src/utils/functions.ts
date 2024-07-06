const images = import.meta.glob(
  "/public/assets/avatar-user/*.{jpg,png,jpeg,gif}"
);

export const getRandomImage = (): string => {
  const keys = Object.keys(images);
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
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
