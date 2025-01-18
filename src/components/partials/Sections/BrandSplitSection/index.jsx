import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import { useEffect, useState } from "react";

const BrandSplitSection = ({ outletCode, startDate, endDate }) => {
  const { user } = useAuthenticationState();
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState(null);

  const getBrandSplitData = async () => {
    if (!outletCode || !startDate || !endDate || startDate === endDate) {
      setData(null);
      return;
    }

    try {
      setIsLoading(true);
      const url = `${URLS.baseURL}/app/user/outlet-bar/${outletCode}?startDate=${startDate}&endDate=${endDate}`;
      const settings = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: user,
        },
      };

      const response = await fetch(url, settings);
      const result = await response.json();

      setData(result.labels.length > 0 ? result : null);
    } catch (error) {
      console.error("Error fetching brand split data:", error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBrandSplitData();
  }, [outletCode, startDate, endDate, user]);

  const RenderRow = ({ label, value }) => (
    <div className="flex justify-between border-b border-primary p-4">
      <p className="flex-1 text-primary">{label}</p>
      <p className="flex-1 text-right text-primary">{value}</p>
    </div>
  );

  if (isLoading) {
    return <div className="text-center text-primary">Loading...</div>;
  }

  if (data) {
    return (
      <>
        <div className="space-y-2">
          <div className="flex justify-between border-b border-primary p-2">
            <p className="flex-1 font-bold text-primary">Name</p>
            <p className="flex-1 text-right font-bold text-primary">Value</p>
          </div>
          <div>
            {data?.labels?.map((label, index) => (
              <RenderRow
                key={index}
                label={label}
                value={data?.datasets[0]?.data?.[index]}
              />
            ))}
          </div>
        </div>
      </>
    );
  }
};

export default BrandSplitSection;
