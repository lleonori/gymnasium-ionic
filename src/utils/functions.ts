const images = import.meta.glob(
  "/public/assets/avatar-user/*.{jpg,png,jpeg,gif}"
);

export const getRandomImage = (): string => {
  const keys = Object.keys(images);
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
};
