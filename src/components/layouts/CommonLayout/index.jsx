import Header from "@/components/partials/Header";
import PrivateRoute from "@/components/partials/PrivateRoute";
import { Outlet } from "react-router-dom";

const CommonLayout = () => {
  return (
    <>
      <PrivateRoute>
        <Header />
        <Outlet />
      </PrivateRoute>
    </>
  );
};

export default CommonLayout;
