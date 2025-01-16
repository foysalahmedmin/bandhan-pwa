import {
  login as loginSlice,
  logout as logoutSlice,
  setIsLoading as setIsLoadingSlice,
  setLoginPanel as setLoginPanelSlice,
  setUserInfo as setUserInfoSlice,
  setUser as setUserSlice,
} from "@/redux/slices/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";

const useAuthenticationState = () => {
  const dispatch = useDispatch();

  const { isLoading, isAuthenticated, user, userInfo, loginPanel } =
    useSelector((state) => state.authentication);

  const login = (parameter) => dispatch(loginSlice(parameter));
  const logout = (parameter) => dispatch(logoutSlice(parameter));
  const setIsLoading = (parameter) => dispatch(setIsLoadingSlice(parameter));
  const setUser = (parameter) => dispatch(setUserSlice(parameter));
  const setUserInfo = (parameter) => dispatch(setUserInfoSlice(parameter));
  const setLoginPanel = (parameter) => dispatch(setLoginPanelSlice(parameter));

  return {
    isLoading,
    isAuthenticated,
    user,
    userInfo,
    loginPanel,
    login,
    logout,
    setIsLoading,
    setUser,
    setUserInfo,
    setLoginPanel,
  };
};

export default useAuthenticationState;
