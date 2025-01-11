import store from "@/redux/store";
import { Provider } from "react-redux";

export const ReduxProvider = ({ children, ...props }) => {
  return (
    <Provider store={store} {...props}>
      {children}
    </Provider>
  );
};
