import api from "../base";

export const getAllBrands = async () => {
  try {
    const response = await api.get("/api/sob/brand");
    if (response.status === 200) {
      return response.data;
    } else {
      alert(response?.error?.message);
    }
  } catch (error) {
    console.log("🚀 ~ getAllBrands ~ error:", error);

    alert(error.message);
  }
};
