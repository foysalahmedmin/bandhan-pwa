// Layouts
import AuthenticationLayout from "@/components/layouts/AuthenticationLayout";
import CommonLayout from "@/components/layouts/CommonLayout";
import RootLayout from "@/components/layouts/RootLayout";

// Partials Pages
import ErrorPage from "@/pages/(partials)/ErrorPage";

// Common Pages
import SignInPage from "@/pages/(authentication)/SignInPage";
import EASAdvocacyPage from "@/pages/(common)/EASAdvocacyPage";
import HomePage from "@/pages/(common)/HomePage";
import LocationPage from "@/pages/(common)/LocationPage";
import OutletPage from "@/pages/(common)/OutletPage";
import RewardPage from "@/pages/(common)/RewardPage";
import SettingsPage from "@/pages/(common)/SettingsPage";

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
            path: "/settings",
            element: <SettingsPage />,
          },
          {
            path: "/notifications",
          },
          {
            path: "/call-status",
            element: <OutletPage />,
          },
          {
            path: "/communication-pannel",
          },
          {
            path: "/select-reward",
            element: <RewardPage />,
          },
          {
            path: "/outlet-location-instruction",
            element: <LocationPage />,
          },
          {
            path: "/eas-advocacy",
            element: <EASAdvocacyPage />,
          },
        ],
      },
      {
        path: "/authentication",
        element: <AuthenticationLayout />,
        children: [
          {
            path: "sign-in",
            element: <SignInPage />,
          },
        ],
      },
    ],
  },
];
