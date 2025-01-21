import api from "../base";

export const locationCheck = async (outletCode, latitude, longitude) => {
  try {
    const response = await api.get(
      `/api/location/check?code=${outletCode}&lon=${longitude}&lat=${latitude}`,
    );

    if (response.status === 200) {
      return response.data;
    } else {
      alert(response?.error?.message);
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: locationCheck.js:15 ~ locationCheck ~ error:",
      JSON.stringify(error),
    );
    alert(error.message);
  }
};

export const updateLocation = async (payload) => {
  try {
    const response = await api.post("/app/outlet/location", payload);
    if (response.status === 200) {
      return response.data;
    } else {
      alert(response?.error?.message);
    }
  } catch (error) {
    alert(error.message);
  }
};

export const getOutletWiseLocation = async (outlet) => {
  try {
    console.log(
      "`/api/outlet/location/${outlet}`",
      `/api/outlet/location/${outlet}`,
    );
    const response = await api.get(`/api/outlet/location/${outlet}`);

    return response?.data?.location?.coordinates;
  } catch (error) {
    console.log(
      "🚀 ~ file: locationCheck.js:40 ~ getOutletWiseLcation ~ error:",
      error,
    );
    alert(error.message);
  }
};
