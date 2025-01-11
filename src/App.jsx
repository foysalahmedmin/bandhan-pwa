import Toaster from "@/components/partials/Toaster";
import Providers from "@/components/providers";
import { routes } from "@/routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import "./extensions";

const App = () => {
  const router = createBrowserRouter(routes, {
    future: { v7_relativeSplatPath: true },
  });
  return (
    <div>
      <Providers>
        <RouterProvider router={router} />
        <Toaster />
      </Providers>
    </div>
  );
};

export default App;
