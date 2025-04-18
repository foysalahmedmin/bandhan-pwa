import { useEffect, useState } from "react";

import PannelCard from "@/components/partials/Cards/PannelCard";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";

const CommunicationPage = () => {
  const { user } = useAuthenticationState();
  const { isEnglish } = useLanguageState();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getDataFromLocalStorage = () => {
      try {
        const value = localStorage.getItem("communication-data");
        if (value !== null) {
          setData(JSON.parse(value));
        }
      } catch (error) {
        console.error("Error reading localStorage data:", error);
      }
    };

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const settings = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user,
          },
        };
        const response = await fetch(
          `${URLS.baseURL}/app/communication/all`,
          settings,
        );
        const data = await response.json();
        localStorage.setItem("communication-data", JSON.stringify(data));
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
    if (!data) {
      getDataFromLocalStorage();
    }
  }, [data, user]);

  useEffect(() => {
    if (data) {
      data?.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }, [data]);

  return (
    <main>
      <section className="py-4">
        <div className="container space-y-4">
          {data?.length > 0 ? (
            <ul className="space-y-2">
              {data?.map((item, index) => (
                <li key={index}>
                  <PannelCard item={item} index={index} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground">
              {isEnglish ? "No data found" : "কোন ডেটা পাওয়া যায়নি"}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default CommunicationPage;
