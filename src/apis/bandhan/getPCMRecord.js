import api from "../base";

export const getPCMRecord = async (outlet) => {
  try {
    const response = await api.get(`/api/last/callcard/${outlet}`);
    // const response = await api.get(`/api/last/callcard/1002303490`);

    if (response.status === 200 && response?.data?.pcm !== undefined) {
      return response?.data?.pcm;
    } else if (response?.data?.pcm === undefined) {
      return undefined;
    } else {
      alert(response?.error?.message);
    }
  } catch (error) {
    alert(error.message);
  }
};
