import { COLORS } from "@/constants/colors";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

// Reusable Pie Chart Component
const PerformancePieChart = ({ title, value, label, target, achieved }) => {
  const percentage = ((achieved / target) * 100).toFixed(2);
  return (
    <div className="rounded-lg border bg-background shadow-lg">
      <div className="space-y-2 p-2 text-center">
        <div>
          <p className="text-xs font-normal text-primary">
            {label}: {target}
          </p>
          <p className="text-xs font-normal text-primary">
            Achieved: {achieved}
          </p>
        </div>
        <div className="px-6">
          <PieChart
            data={[
              { title: "Achieved", value, color: "#2b87e3" },
              { title: "Remaining", value: 100 - value, color: COLORS.primary },
            ]}
            radius={50}
            lineWidth={20}
            paddingAngle={5}
          />
          <p className="text-sm font-bold">Ach: {percentage}%</p>
        </div>
      </div>
      <div className="bg-primary py-2 text-center text-sm text-white">
        <p className="font-medium">{title}</p>
        <p className="font-medium">{label}</p>
      </div>
    </div>
  );
};

const PerformanceChartsSection = ({ outletCode, startDate, endDate }) => {
  const { user, userInfo } = useAuthenticationState();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [newData, setNewData] = useState({});

  useEffect(() => {
    const getData = async () => {
      if (outletCode && startDate && endDate && startDate !== endDate) {
        try {
          setIsLoading(true);
          const url =
            URLS?.baseURL +
            `/app/stat/call-cards?outletCode=${outletCode}&startDate=${startDate}&endDate=${endDate}&tmsId=${userInfo?._id}`;
          const resData = await axios.get(url);
          setNewData(resData?.data);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setData(null);
      }
    };
    getData();
  }, [outletCode, startDate, endDate, user, userInfo?._id]);

  useEffect(() => {
    const fetchData = async () => {
      if (outletCode && startDate && endDate && startDate !== endDate) {
        try {
          setIsLoading(true);
          const setting = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: user,
            },
          };
          const url =
            URLS?.baseURL +
            `/app/user/outlet-charts/${outletCode}?startDate=${startDate}&endDate=${endDate}`;
          const res = await fetch(url, setting);
          const json = await res.json();
          setData(json);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setData(null);
      }
    };
    fetchData();
  }, [outletCode, startDate, endDate, user]);

  if (isLoading) {
    return <div className="text-center text-primary">Loading...</div>;
  }
  if (data) {
    return (
      <>
        <div className="grid grid-cols-2 gap-2">
          <PerformancePieChart
            title="Focus"
            label={data?.focusedVolume?.labels[0]}
            target={data?.focusedVolume?.data[0]}
            achieved={data?.focusedVolume?.data[1]}
            value={(
              (data?.focusedVolume?.data[1] / data?.focusedVolume?.data[0]) *
              100
            ).toFixed(2)}
          />
          <PerformancePieChart
            title="Volume RMC"
            label={data?.volumeRMC?.labels[0]}
            target={data?.volumeRMC?.data[0]}
            achieved={data?.volumeRMC?.data[1]}
            value={(
              (data?.volumeRMC?.data[1] / data?.volumeRMC?.data[0]) *
              100
            ).toFixed(2)}
          />
          <PerformancePieChart
            title="EAS"
            label={data?.eas?.labels[0]}
            target={data?.eas?.data[0]}
            achieved={data?.eas?.data[1]}
            value={((data?.eas?.data[1] / data?.eas?.data[0]) * 100).toFixed(2)}
          />
          <PerformancePieChart
            title="Outlet Visit"
            label="Call Report Target"
            target={newData?.target || 0}
            achieved={newData?.achievement || 0}
            value={(newData?.achievement / newData?.target) * 100 || 0}
          />
        </div>
      </>
    );
  }
};

export default PerformanceChartsSection;
