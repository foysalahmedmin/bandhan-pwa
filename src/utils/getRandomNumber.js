export const getRandomNumber = (payload) => {
  const validKeys = Object.keys(payload).filter((key) => {
    const value = payload[key];
    const count = parseInt(value.count);
    if (count === 0 || value.value === false) {
      return;
    } else return key;
  });
  if (validKeys.length === 0) {
    return null; // Handle the case where no valid keys are found
  }
  const randomIndex = Math.floor(Math.random() * validKeys.length);
  return validKeys[randomIndex];
};
