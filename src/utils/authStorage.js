const authStorage = {
  storeAuthToken: (authToken) => {
    try {
      localStorage.setItem("authToken", authToken);
    } catch (error) {
      console.error("Error storing the auth token:", error);
    }
  },
  getAuthToken: () => {
    try {
      return localStorage.getItem("authToken");
    } catch (error) {
      console.error("Error getting the auth token:", error);
    }
  },
  removeAuthToken: () => {
    try {
      localStorage.removeItem("authToken");
    } catch (error) {
      console.error("Error removing the auth token:", error);
    }
  },
};

export default authStorage;
