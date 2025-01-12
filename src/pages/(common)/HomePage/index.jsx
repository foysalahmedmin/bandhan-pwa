import {
  ChartPie,
  DistributeVerticalCenter,
  GiftBox,
  LocationPin,
  Podcast,
} from "@/assets/svg/home-page";
import { Link } from "react-router-dom";

const HomePage = () => {
  const data = [
    {
      label: "Outlet & Call Card Status",
      path: "/call-status",
      icon: <ChartPie className="size-full" />,
    },
    {
      label: "Communication Pannel",
      path: "/communication-pannel",
      icon: <Podcast className="size-full" />,
    },
    {
      label: "Select Reward",
      path: "/select-reward",
      icon: <GiftBox className="size-full" />,
    },
    {
      label: "Outlet Location Instruction",
      path: "/outlet-location-instruction",
      icon: <LocationPin className="size-full" />,
    },
    {
      label: "EAS Advocacy",
      path: "/eas-advocacy",
      icon: <DistributeVerticalCenter className="size-full" />,
    },
  ];
  return (
    <main>
      <section className="py-4">
        <div className="container">
          <div className="grid grid-cols-2 gap-4">
            {data?.map(({ label, path, icon }, index) => (
              <Link
                key={index}
                to={path}
                className="flex aspect-square w-full shrink-0 items-center justify-center self-stretch rounded-md bg-primary/25 p-4 text-center shadow"
              >
                <div className="space-y-2">
                  <div className="mx-auto flex aspect-square w-1/2 items-center justify-center text-primary">
                    {icon}
                  </div>
                  <div>
                    <strong className="block leading-tight">{label}</strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
