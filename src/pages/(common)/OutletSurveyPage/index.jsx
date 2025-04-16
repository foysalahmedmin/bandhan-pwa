import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import Select from "@/components/ui/Select";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import { cn } from "@/lib/utils";
import axios from "axios";
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
  const [outletStatus, setOutletStatus] = useState({});

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
    if (!outlets || outlets?.length <= 0) return;
    const outletCodes = outlets?.map((outlet) => outlet?.value);
    const getPhases = async () => {
      {
        setIsLoading(true);
        try {
          const now = new Date();
          const currentMonth = `${now.getMonth() + 1}-${now.getFullYear()}`;
          const currentYear = now.getFullYear();
          const response = await axios.post(
            URLS.baseURL +
              `/api/outlet-survey/get-phases-with-outlets-surveys?month=${currentMonth}&year=${currentYear}`,
            {
              outletCodes: outletCodes || [],
            },
            { headers: { Authorization: user } },
          );
          if (response?.status === 200) {
            setPhase(response?.data?.data);
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
  }, [user, outlets]);

  useLayoutEffect(() => {
    if (!selectedPhase?.outlets?.length || !outletDetails) return;

    const outletStatus =
      selectedPhase?.outlets?.find(
        (outletSurvey) => outletSurvey?._id === outletDetails?.code,
      ) || {};
    setOutletStatus(outletStatus);
  }, [selectedPhase, outletDetails]);

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
          {phases?.length > 0 && (
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
                      <div className="mt-2 flex items-center gap-2">
                        <p className="text-sm font-medium">
                          Total Outlet:{" "}
                          <span className="font-bold">
                            {outlets?.length || 0}
                          </span>
                        </p>
                        <div className="w-1 self-stretch bg-border" />
                        <p className="text-sm font-medium">
                          Completed:{" "}
                          <span className="font-bold">
                            {phase?.completed_outlets || 0}
                          </span>
                        </p>
                        <div className="w-1 self-stretch bg-border" />
                        <p className="text-sm font-medium">
                          Incomplete :{" "}
                          <span className="font-bold">
                            {outlets?.length - (phase?.completed_outlets || 0)}
                          </span>
                        </p>
                      </div>
                      <p className="mt-2 text-sm font-medium">
                        {phase?.isComplete ? (
                          <span className="text-green-500">
                            Complete All Outlet
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {phase?.name} Survey Not Complete Yet
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {selectedPhase?._id && outletDetails?._id && (
            <div
              className={cn(
                "cursor-pointer rounded-lg border bg-white/50 p-4 shadow-md backdrop-blur transition hover:bg-white/75",
                {
                  "pointer-events-none bg-white/25 opacity-50":
                    !selectedPhase?.isActive ||
                    !(selectedPhase?.questions?.length > 0),
                },
                {
                  "bg-white/75 outline outline-2 outline-primary":
                    selectedPhase?._id === selectedPhase?._id,
                },
              )}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h5 className="text-lg font-semibold">{selectedPhase?.name}</h5>
                <div className="w-1 self-stretch bg-border" />
                <h5 className="text-lg font-semibold">{outletDetails?.name}</h5>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>
                  {new Date(selectedPhase?.start_date).toLocaleDateString(
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
                  {new Date(selectedPhase?.end_date).toLocaleDateString(
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
                  {selectedPhase?.questions?.length || 0}
                </span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-sm font-medium">
                  Total Outlet:{" "}
                  <span className="font-bold">{outlets?.length || 0}</span>
                </p>
                <div className="w-1 self-stretch bg-border" />
                <p className="text-sm font-medium">
                  Completed:{" "}
                  <span className="font-bold">
                    {selectedPhase?.completed_outlets || 0}
                  </span>
                </p>
              </div>
              <p className="mt-2 text-sm font-medium">
                {outletStatus?._id ? (
                  <span className="font-bold text-green-500">
                    {outletDetails?.name} Is Complete
                  </span>
                ) : (
                  <span className="font-bold text-red-500">
                    {outletDetails?.name} Survey Not Complete Yet
                  </span>
                )}
              </p>
            </div>
          )}
          <div className="text-right">
            <Button
              onClick={() =>
                navigate(`/outlet-survey-questions`, {
                  state: {
                    totalOutlets: outlets?.length,
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
                !outletDetails?._id ||
                !selectedPhase?._id ||
                !!outletStatus?._id ||
                isLoading
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
