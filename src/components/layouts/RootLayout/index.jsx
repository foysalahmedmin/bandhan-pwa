import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const { isLoading, user, setIsLoading, setUserInfo } =
    useAuthenticationState();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    const getUserInfo = async () => {
      try {
        setIsLoading(true);
        const settings = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user,
          },
        };
        const response = await fetch(URLS.baseURL + "/app/user/info", settings);
        const data = await response?.json();

        if (data?.code === 200) {
          setUserInfo(data?.data || {});
        } else {
          setUserInfo({});
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
  }, [user, isOnline]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default RootLayout;
