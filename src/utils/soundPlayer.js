export const playSampleSound = (soundPath = "/sounds/notification.mp3") => {
  try {
    const audio = new Audio(soundPath);
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  } catch (error) {
    console.error("Failed to play sound:", error);
  }
};
