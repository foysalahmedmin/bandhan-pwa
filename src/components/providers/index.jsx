import { LocationProvider } from "./LocationProvider";
import { ReduxProvider } from "./ReduxProvider";

const Providers = ({ children }) => {
  return (
    <>
      <ReduxProvider>
        <LocationProvider>{children}</LocationProvider>
      </ReduxProvider>
    </>
  );
};

export default Providers;
