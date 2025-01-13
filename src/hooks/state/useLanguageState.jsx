import {
  setLanguage as setLanguageSlice,
  toggleLanguage as toggleLanguageSlice,
} from "@/redux/slices/languageSlice";
import { useDispatch, useSelector } from "react-redux";

const useLanguageState = () => {
  const dispatch = useDispatch();

  const language = useSelector((state) => state.language);
  const setLanguage = (parameter) => dispatch(setLanguageSlice(parameter));
  const toggleLanguage = (parameter) =>
    dispatch(toggleLanguageSlice(parameter));

  return {
    language,
    isEnglish: language === "en",
    isBangla: language === "bn",
    setLanguage,
    toggleLanguage,
  };
};

export default useLanguageState;
