import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const handleNotifications = (notifications) => {
    if (!notifications?.length > 0) return;

    const sortedNotifications = notifications?.sort(
      (a, b) => new Date(b?.date) - new Date(a?.date),
    );

    setNotifications(sortedNotifications);
  };

  useEffect(() => {
    const loadStoredNotifications = () => {
      const storedNotifications =
        JSON.parse(localStorage.getItem("notifications")) || [];
      handleNotifications(storedNotifications);
    };

    loadStoredNotifications();
  }, []);

  // useEffect(() => {
  //   const socket = io(URLS.baseURL);

  //   const handleSocketEvents = () => {
  //     socket.on("connect", () => {
  //       console.log("Socket connected");
  //     });

  //     socket.on("error", (error) => {
  //       console.error("Socket error:", error);
  //     });

  //     socket.on("notification", (data) => {
  //       handleNotifications((prevState) => [
  //         ...prevState,
  //         { ...data, viewed: false },
  //       ]);
  //       // playSampleSound();
  //     });
  //   };

  //   handleSocketEvents();

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const handleNotification = (item) => {
    const markAsViewed = () => {
      const prevNotifications =
        JSON.parse(localStorage.getItem("notifications")) || [];

      const modified = prevNotifications.map((notification) => ({
        ...notification,
        viewed: item?.name === notification?.name ? true : notification?.viewed,
      }));

      localStorage.setItem("notifications", JSON.stringify(modified));
      handleNotifications(modified);
    };

    markAsViewed();
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        handleNotifications,
        handleNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
