// Layouts
import AuthenticationLayout from "@/components/layouts/AuthenticationLayout";
import CommonLayout from "@/components/layouts/CommonLayout";
import RootLayout from "@/components/layouts/RootLayout";

// Partials Pages
import ErrorPage from "@/pages/(partials)/ErrorPage";

// Common Pages
import SignInPage from "@/pages/(authentication)/SignInPage";
import CallStatusPage from "@/pages/(common)/CallStatusPage";
import CommunicationPage from "@/pages/(common)/CommunicationPage";
import CommunicationPannelPage from "@/pages/(common)/CommunicationPannelPage";
import EASAdvocacyPage from "@/pages/(common)/EASAdvocacyPage";
import GuidelinePage from "@/pages/(common)/GuidelinePage";
import HomePage from "@/pages/(common)/HomePage";
import LocationPage from "@/pages/(common)/LocationPage";
import NotificationsPage from "@/pages/(common)/NotificationPage";
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
            element: <NotificationsPage />,
          },
          {
            path: "/call-status",
            element: <CallStatusPage />,
          },
          {
            path: "/communication-pannel",
            element: <CommunicationPannelPage />,
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
          {
            path: "/communication",
            element: <CommunicationPage />,
          },
          {
            path: "/guideline",
            element: <GuidelinePage />,
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
