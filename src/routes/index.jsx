// Layouts
import CommonLayout from "@/components/layouts/CommonLayout";
import RootLayout from "@/components/layouts/RootLayout";

// Partials Pages
import ErrorPage from "@/pages/(partials)/ErrorPage";

// Common Pages
import HomePage from "@/pages/(common)/HomePage";

export const routes = [
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <CommonLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/notifications",
          },
          {
            path: "/call-status",
          },
          {
            path: "/communication-pannel",
          },
          {
            path: "/select-reward",
          },
          {
            path: "/outlet-location-instruction",
          },
          {
            path: "/eas-advocacy",
          },
        ],
      },
    ],
  },
];
