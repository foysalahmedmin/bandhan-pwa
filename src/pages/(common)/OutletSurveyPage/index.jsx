import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import Select from "@/components/ui/Select";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OutletSurveyPage = () => {
  const { isEnglish } = useLanguageState();
  const { user, userInfo } = useAuthenticationState();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState({});

  const [selectedPhase, setSelectedPhase] = useState({});

  const [outletDetails, setOutletDetails] = useState({});

  const [phases, setPhase] = useState([]);

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
  }, [user, selectedOutlet?.value]);

  useLayoutEffect(() => {
    const getPhases = async () => {
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
            URLS.baseURL + `/api/outlet-survey/get-phases`,
            settings,
          );
          const data = await response.json();
          if (response?.status === 200) {
            setPhase(data?.data);
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
    getPhases();
  }, [user]);
  return (
    <main>
      <section className="py-4">
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
            {Object.keys(outletDetails || {})?.length > 0 && (
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
          {selectedOutlet?.value && (
            <div className="space-y-2 border border-primary p-2">
              <span className="block font-semibold text-primary">
                {isEnglish ? "Survey Phases" : "সার্ভে ফেইজ"}
              </span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {phases?.map((phase, index) => {
                  return (
                    <div
                      key={index}
                      className={cn(
                        "cursor-pointer rounded-lg border bg-white/50 p-4 shadow-md backdrop-blur transition hover:bg-white/75",
                        {
                          "pointer-events-none bg-white/25 opacity-50":
                            !phase?.isActive || !(phase?.questions?.length > 0),
                        },
                        {
                          "bg-white/75 outline outline-2 outline-primary":
                            phase?._id === selectedPhase?._id,
                        },
                      )}
                      onClick={() => {
                        if (!phase?.isActive || !(phase?.questions?.length > 0))
                          return;
                        setSelectedPhase(phase);
                      }}
                      disabled={!phase?.isActive}
                    >
                      <h5 className="mb-2 text-lg font-semibold">
                        {phase?.name}
                      </h5>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span>
                          {new Date(phase?.start_date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                        <span className="mx-2">-</span>
                        <span>
                          {new Date(phase?.end_date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-medium">
                        Total Questions:{" "}
                        <span className="font-bold">
                          {phase?.questions?.length || 0}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="text-right">
            <Button
              onClick={() =>
                navigate(`/outlet-survey-questions`, {
                  state: {
                    outlet: outletDetails,
                    outletId: outletDetails?._id,
                    outletCode: outletDetails?.code,
                    outletName: outletDetails?.name,
                    communication: outletDetails?.communication?.file,
                    salesPoint: selectedOutlet,
                    phase: selectedPhase,
                  },
                })
              }
              disabled={
                !selectedOutlet?.value || !selectedPhase?._id || isLoading
              }
            >
              <span>{isEnglish ? "Outlet Survey" : "আউটলেট সার্ভে"}</span>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OutletSurveyPage;
