import { LocationProvider } from "./LocationProvider";
import { NotificationsProvider } from "./NotificationsProvider";
import { ReduxProvider } from "./ReduxProvider";

const Providers = ({ children }) => {
  return (
    <>
      <ReduxProvider>
        <NotificationsProvider>
          <LocationProvider>{children}</LocationProvider>
        </NotificationsProvider>
      </ReduxProvider>
    </>
  );
};

export default Providers;
