import api from "../base";

export const getSelectedbrand = async () => {
  try {
    const response = await api.get("/api/selected-brands");

    if (response.status === 200) {
      return response.data;
    } else {
      alert(response?.error?.message);
    }
  } catch (error) {
    alert(error.message);
  }
};
