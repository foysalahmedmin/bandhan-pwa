import BrandSplitSection from "@/components/partials/Sections/BrandSplitSection";
import PerformanceChartsSection from "@/components/partials/Sections/PerformanceChartsSection";
import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import Select from "@/components/ui/Select";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import moment from "moment";
import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OutletPage = () => {
  const { isEnglish } = useLanguageState();
  const { user, userInfo } = useAuthenticationState();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState({});

  const [outletDetails, setOutletDetails] = useState({});

  const [showDeployedPCM, setShowDeployedPCM] = useState("");

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );

  useLayoutEffect(() => {
    if (userInfo.outletCode) {
      setOutlets(userInfo.outletCode);
    }
  }, [userInfo.outletCode]);

  useLayoutEffect(() => {
    if (!user || !selectedOutlet?.value) return;
    const getOutletDetails = async () => {
      {
        setIsLoading(true);
        try {
          const settings = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: user,
            },
          };

          const response = await fetch(
            URLS.baseURL + `/app/outlet/${selectedOutlet?.value}`,
            settings,
          );
          const data = await response.json();

          if (response?.status === 200) {
            setOutletDetails(data);
            const pcm = data?.target?.deployedPCM;
            pcm ? setShowDeployedPCM(pcm) : setShowDeployedPCM("");
          } else {
            // alert("Error", resData?.message);
          }
        } catch (error) {
          console.error("Error", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    getOutletDetails();
  }, [user, selectedOutlet?.value, showDeployedPCM]);

  return (
    <main>
      <section>
        <div className="container space-y-4">
          <div className="space-y-2">
            <span className="block font-semibold text-primary">
              {isEnglish ? "Select Outlet Code" : "আউটলেট কোড নির্বাচন করুন"}
            </span>
            <div>
              <label className="grid cursor-pointer grid-cols-4 items-center gap-2">
                <span className="text-sm">
                  {isEnglish ? "Outlet" : "আউটলেট"}
                </span>
                <Select
                  className="col-span-3"
                  value={selectedOutlet}
                  options={outlets || []}
                  onChange={(item) => {
                    setSelectedOutlet(item);
                  }}
                />
              </label>
            </div>
            {Object.keys(outletDetails)?.length > 0 && (
              <div className="space-y-2">
                <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                  <span className="text-sm leading-none">
                    {isEnglish ? "Outlet Name" : "আউটলেট নাম"}
                  </span>
                  <FormControl
                    as="div"
                    className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                  >
                    {outletDetails?.name}
                  </FormControl>
                </div>
                <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                  <span className="text-sm leading-none">
                    {isEnglish ? "Outlet Code" : "আউটলেট কোড"}
                  </span>
                  <FormControl
                    as="div"
                    className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                  >
                    {outletDetails?.code}
                  </FormControl>
                </div>
                <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                  <span className="text-sm leading-none">
                    {isEnglish ? "Retailer Name" : "রিটেলার নাম"}
                  </span>
                  <FormControl
                    as="div"
                    className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                  >
                    {outletDetails?.retailer?.name}
                  </FormControl>
                </div>
                <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                  <span className="text-sm leading-none">
                    {isEnglish ? "Retailer Number" : "রিটেলার নাম্বার"}
                  </span>
                  <FormControl
                    as="div"
                    className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                  >
                    {outletDetails?.retailer?.phone}
                  </FormControl>
                </div>
                <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                  <span className="text-sm leading-none">
                    {isEnglish ? "Retailer Address" : "রিটেলার ঠিকানা"}
                  </span>
                  <FormControl
                    as="div"
                    className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                  >
                    {outletDetails?.retailer?.address}
                  </FormControl>
                </div>
                <div className="grid cursor-pointer grid-cols-4 items-center gap-2">
                  <span className="text-sm leading-none">
                    {isEnglish ? "Retailer Category" : "রিটেলার ক্যাটাগরি"}
                  </span>
                  <FormControl
                    as="div"
                    className="pointer-events-none col-span-3 h-auto min-h-form-control justify-center text-center text-sm"
                  >
                    {outletDetails?.category}
                  </FormControl>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <span className="block font-semibold text-primary">
              {isEnglish
                ? "Select the start and end date to see the performance of this outlet"
                : "এই আউটলেট এর পারফরমেন্স দেখতে শুরু ও শেষ এর তারিখ নির্বাচন করুন"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid cursor-pointer items-center gap-2">
              <span className="text-sm leading-none">
                {isEnglish ? "Start Date" : "শুরুর তারিখ"}
              </span>
              <FormControl
                onChange={(e) =>
                  setStartDate(moment(e.target.value).format("YYYY-MM-DD"))
                }
                value={startDate}
                as="input"
                type="date"
                className="justify-center overflow-visible text-center text-sm"
              />
            </div>
            <div className="grid cursor-pointer items-center gap-2">
              <span className="text-sm leading-none">
                {isEnglish ? "End Date" : "শেষ তারিখ"}
              </span>
              <FormControl
                onChange={(e) =>
                  setEndDate(moment(e.target.value).format("YYYY-MM-DD"))
                }
                value={endDate}
                as="input"
                type="date"
                className="justify-center overflow-visible text-center text-sm"
              />
            </div>
          </div>

          {!(selectedOutlet?.value && startDate && endDate) && (
            <span className="text-sm text-muted-foreground">
              {isEnglish
                ? "Select an outlet and date range to view performance"
                : "একটি আউটলেট এর সাথে শুরু ও শেষ তারিখ নির্বাচন করুন"}
            </span>
          )}

          {selectedOutlet?.value && startDate && endDate && (
            <div className="space-y-2 border border-primary p-2">
              <span className="block font-semibold text-primary">
                {isEnglish ? "Performance Dashboard" : "পারফরমেন্স ড্যাশবোর্ড"}
              </span>
              <div>
                <PerformanceChartsSection
                  outletCode={selectedOutlet?.value}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>
          )}

          {selectedOutlet?.value && startDate && endDate && (
            <div className="space-y-2 border border-primary p-2">
              <span className="block font-semibold text-primary">
                {isEnglish ? "IMS Brand Split" : "আইএমএস ব্র্যান্ড স্প্লিট"}
              </span>
              <div>
                <BrandSplitSection
                  outletCode={selectedOutlet?.value}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>
          )}

          <div className="text-right">
            <Button
              onClick={() =>
                navigate("communication-video", {
                  outletCode: outletDetails?.code,
                  outletName: outletDetails?.name,
                  communication: outletDetails?.communication?.file,
                  salesPoint: selectedOutlet,
                })
              }
              disabled={!selectedOutlet?.value || isLoading}
            >
              <span>{isEnglish ? "Call Card" : "কল কার্ড"}</span>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OutletPage;
