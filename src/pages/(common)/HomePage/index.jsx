import {
  ChartPie,
  DistributeVerticalCenter,
  GiftBox,
  LocationPin,
  Podcast,
} from "@/assets/svg/home-page";
import useLanguageState from "@/hooks/state/useLanguageState";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { isEnglish } = useLanguageState();
  const data = [
    {
      path: "/call-status",
      icon: <ChartPie className="size-full" />,
      labels: {
        en: "Outlet & Call Card Status",
        bn: "আউটলেট ও কল কার্ড স্ট্যাটাস",
      },
    },
    {
      path: "/communication-pannel",
      icon: <Podcast className="size-full" />,
      labels: {
        en: "Communication Pannel",
        bn: "যোগাযোগ প্যানেল",
      },
    },
    {
      path: "/select-reward",
      icon: <GiftBox className="size-full" />,
      labels: {
        en: "Select Reward",
        bn: "রিওয়ার্ড নির্বাচন",
      },
    },
    {
      path: "/outlet-location-instruction",
      icon: <LocationPin className="size-full" />,
      labels: {
        en: "Outlet Location Instruction",
        bn: "আউটলেট লোকেশন নির্দেশনা",
      },
    },
    {
      path: "/eas-advocacy",
      icon: <DistributeVerticalCenter className="size-full" />,
      labels: {
        en: "EAS Advocacy",
        bn: "ইএএস এডভোকেসি",
      },
    },
  ];
  return (
    <main>
      <section>
        <div className="container">
          <div className="grid grid-cols-2 gap-4">
            {data?.map(({ labels, path, icon }, index) => (
              <Link
                key={index}
                to={path}
                className="flex aspect-square w-full shrink-0 items-center justify-center self-stretch rounded-md bg-primary/25 p-4 text-center shadow"
              >
                <div className="w-full space-y-2 md:space-y-4">
                  <div className="mx-auto flex aspect-square w-1/2 items-center justify-center text-primary md:w-1/3">
                    {icon}
                  </div>
                  <div>
                    <strong className="block leading-tight">
                      {isEnglish ? labels?.en : labels?.bn}
                    </strong>
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
