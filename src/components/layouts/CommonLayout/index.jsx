import Header from "@/components/partials/Header";
import PrivateRoute from "@/components/partials/PrivateRoute";
import UserInfo from "@/components/partials/UserInfo";
import { Outlet } from "react-router-dom";

const CommonLayout = () => {
  return (
    <>
      <PrivateRoute>
        <Header />
        <Outlet />
        <UserInfo />
      </PrivateRoute>
    </>
  );
};

export default CommonLayout;
