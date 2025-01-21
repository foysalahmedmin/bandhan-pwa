import api from "../base";

export const getCurrentCommunication = async () => {
  try {
    const response = await api.get("/api/current-communication");

    if (response.status === 200) {
      const currentIndex = response?.data?.findIndex(
        (item) => item.current === true,
      );

      if (currentIndex !== -1) {
        return response?.data[currentIndex];
      } else {
        return {};
      }
    } else {
      alert(response?.error?.message);
    }
  } catch (error) {
    console.log("🚀 ~ getCurrentCommunication ~ error:", error);

    alert(error.message);
  }
};
