import { Book, Podcast } from "@/assets/svg/home-page";
import useLanguageState from "@/hooks/state/useLanguageState";
import { Link } from "react-router-dom";

const CommunicationPannelPage = () => {
  const { isEnglish } = useLanguageState();
  const data = [
    {
      path: "/communication",
      icon: <Podcast className="size-full" />,
      labels: {
        en: "Communication",
        bn: "কমিউনিকেশন",
      },
    },
    {
      path: "/guideline",
      icon: <Book className="size-full" />,
      labels: {
        en: "Guideline",
        bn: "গাইডলাইন",
      },
    },
  ];
  return (
    <main>
      <section className="py-4">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
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

export default CommunicationPannelPage;
