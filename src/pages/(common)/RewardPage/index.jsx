import api from "@/apis/base";
import { Button } from "@/components/ui/Button";
import {
  Modal,
  ModalBackdrop,
  ModalCloseTrigger,
  ModalContent,
} from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useLayoutEffect, useState } from "react";

const RewardCard = ({ item, className, ...props }) => {
  const { image, label } = item;

  return (
    <div
      className={cn(
        "grid h-20 grid-cols-2 items-center gap-2 rounded-md border border-primary bg-card p-2",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center overflow-hidden text-center">
        <img
          className="h-full max-h-full max-w-full object-contain object-center"
          src={image}
          alt="incentive photo"
        />
      </div>
      <div className="text-sm leading-none">{label}</div>
    </div>
  );
};

const RewardPage = () => {
  const { isEnglish } = useLanguageState();
  const { userInfo } = useAuthenticationState();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState({});

  const outletName = selectedOutlet?.label?.split("(")[0];
  const outletCode = selectedOutlet?.label?.split("(")[1].split(")")[0];

  const [preSelectedIncentive, setPreSelectedIncentive] = useState({});
  const isPreSelectedIncentive = Object.keys(preSelectedIncentive)?.length > 0;

  const [incentive1Items, setIncentive1Items] = useState([]);
  const [incentive2Items, setIncentive2Items] = useState([]);
  const [selectedIncentive1, setSelectedIncentive1] = useState(null);
  const [selectedIncentive2, setSelectedIncentive2] = useState(null);
  const [selectedIncentivePhoto1, setSelectedIncentivePhoto1] = useState(null);
  const [selectedIncentivePhoto2, setSelectedIncentivePhoto2] = useState(null);

  const [cycles, setCycles] = useState([
    {
      label: "Cycle 1",
      value: "Cycle 1",
    },
    {
      label: "Cycle 2",
      value: "Cycle 2",
    },
    {
      label: "Cycle 3",
      value: "Cycle 3",
    },
  ]);
  const [selectedCycle, setSelectedCycle] = useState("");

  useLayoutEffect(() => {
    if (userInfo.outletCode) {
      setOutlets(userInfo.outletCode);
    }
  }, [userInfo.outletCode]);

  useLayoutEffect(() => {
    const getSelectedIncentiveData = async () => {
      if (selectedOutlet?.label) {
        const res = await axios.get(
          `${URLS?.baseURL_Server2}/api/getSelectedIncentives?search=${
            selectedOutlet?.label?.split("(")[1].split(")")[0]
          }`,
        );

        res?.data?.data?.length > 0
          ? setPreSelectedIncentive(res?.data?.data[0] || [])
          : setPreSelectedIncentive([]);
      }
    };
    getSelectedIncentiveData();
  }, [selectedOutlet?.label, isUpdated]);

  const getIncentiveItemsByCategoryType = async (category, type) => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/app/incentives?category=${category}&type=${type}`,
      );

      if (response.status === 200) {
        return (
          response?.data.map((item) => {
            return {
              value: item?.name || "",
              label: item?.name || "",
              image: { uri: URLS?.incentiveMediaURL + `${item.photo}` },
            };
          }) || []
        );
      } else {
        alert("Error", "Something went wrong");
      }
    } catch (error) {
      alert("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (!selectedOutlet?.category) return;

    const getIncentivesItems = async () => {
      const incentive1Items = await getIncentiveItemsByCategoryType(
        selectedOutlet?.category,
        "type1",
      );
      const incentive2Items = await getIncentiveItemsByCategoryType(
        selectedOutlet?.category,
        "type2",
      );

      setIncentive1Items(incentive1Items);
      setIncentive2Items(incentive2Items);
    };

    getIncentivesItems();
  }, [selectedOutlet?.category, isUpdated]);

  useLayoutEffect(() => {
    const getEditStatus = async () => {
      const response = await axios.get(
        URLS?.baseURL_Server2 + "/api/getEditStatus",
      );

      if (response?.status === 200) {
        response.data.status === "inactive"
          ? setIsEditable(false)
          : setIsEditable(true);
      } else {
        alert("Error", "Something went wrong");
      }
    };

    getEditStatus();
  }, [selectedOutlet]);

  const handleAddSubmit = async () => {
    try {
      if (
        !selectedIncentive1 ||
        !selectedIncentive2 ||
        !Object.keys(selectedOutlet)?.length > 0
      ) {
        alert("Error", "Please select all fields");
        return;
      }
      setIsLoading(true);
      const payload = {
        region: userInfo.region[0].name,
        regionId: userInfo.region[0].id,
        area: userInfo.area[0].name,
        areaId: userInfo.area[0].id,
        territory: userInfo.territory[0].name,
        territoryId: userInfo.territory[0].id,
        salesPoint: selectedOutlet?.name,
        salesPointId: selectedOutlet?.id,
        tmsName: userInfo.name,
        tmsEnroll: userInfo.enrollId,
        tmsMobile: userInfo.phone,
        outletCode: outletCode,
        outletName: outletName,
        incentiveOne: selectedIncentive1,
        incentiveTwo: selectedIncentive2,
        incentiveOnePhoto: selectedIncentivePhoto1,
        incentiveTwoPhoto: selectedIncentivePhoto2,
      };

      const response = await axios.post(
        URLS?.baseURL_Server2 + "/api/selectNewIncentive",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status == 200) {
        setIsUpdated((prev) => !prev);
        alert("Success", response?.data?.message);
      } else {
        alert("Error", response?.data?.message);
      }
    } catch (error) {
      alert("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        region: userInfo.region[0].name,
        regionId: userInfo.region[0].id,
        area: userInfo.area[0].name,
        areaId: userInfo.area[0].id,
        territory: userInfo.territory[0].name,
        territoryId: userInfo.territory[0].id,
        salesPoint: selectedOutlet?.name,
        salesPointId: selectedOutlet?.id,
        tmsName: userInfo.name,
        tmsEnroll: userInfo.enrollId,
        tmsMobile: userInfo.phone,
        outletCode: outletCode,
        outletName: outletName,
        cycle: selectedCycle,
        incentiveOne: selectedIncentive1
          ? selectedIncentive1
          : preSelectedIncentive?.incentiveOne,
        incentiveTwo: selectedIncentive2
          ? selectedIncentive2
          : preSelectedIncentive?.incentiveTwo,
        incentiveOnePhoto: selectedIncentivePhoto1
          ? selectedIncentivePhoto1
          : preSelectedIncentive?.incentiveOnePhoto,
        incentiveTwoPhoto: selectedIncentivePhoto2
          ? selectedIncentivePhoto2
          : preSelectedIncentive?.incentiveTwoPhoto,
      };

      const response = await axios.put(
        URLS?.baseURL_Server2 +
          `/api/updateOneOutletIncentive/${preSelectedIncentive._id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status == 200) {
        setIsModalOpen(false);
        setIsUpdated((prev) => !prev);
        alert("Success", response?.data?.message);
      } else {
        alert("Error", response?.data?.message);
      }
    } catch (error) {
      alert("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main>
        <section className="py-4">
          <div className="container space-y-4">
            <div className="space-y-2">
              <span className="block font-semibold text-primary">
                {isEnglish
                  ? "Select Incentive Code"
                  : "ইন্সেন্টিভ কোড নির্বাচন করুন"}
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
            </div>
            <div className="space-y-4">
              {isPreSelectedIncentive ? (
                <>
                  <div className="space-y-2">
                    <span className="block font-semibold text-primary">
                      {isEnglish
                        ? "Select Incentive"
                        : "ইন্সেন্টিভ নির্বাচন করুন"}
                    </span>
                    <div className="space-y-2">
                      <label className="grid cursor-pointer grid-cols-4 items-center gap-2">
                        <span className="text-sm">
                          {isEnglish ? "Incentive 1" : "ইন্সেন্টিভ ১"}
                        </span>
                        <div className="col-span-3">
                          <RewardCard
                            item={{
                              image:
                                URLS?.incentiveMediaURL +
                                preSelectedIncentive?.incentiveOnePhoto,
                              label: preSelectedIncentive?.incentiveOne,
                            }}
                          />
                        </div>
                      </label>
                      <label className="grid cursor-pointer grid-cols-4 items-center gap-2">
                        <span className="text-sm">
                          {isEnglish ? "Incentive 2" : "ইন্সেন্টিভ ২"}
                        </span>
                        <div className="col-span-3">
                          <RewardCard
                            item={{
                              image:
                                URLS?.incentiveMediaURL +
                                preSelectedIncentive?.incentiveTwoPhoto,
                              label: preSelectedIncentive?.incentiveTwo,
                            }}
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                  {isEditable && (
                    <div className="text-right">
                      <Button
                        onClick={() => setIsModalOpen(true)}
                        isLoading={isLoading}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <span className="block font-semibold text-primary">
                      {isEnglish
                        ? "Select Incentive"
                        : "ইন্সেন্টিভ নির্বাচন করুন"}
                    </span>
                    <div className="space-y-2">
                      <label className="grid cursor-pointer grid-cols-4 items-center gap-2">
                        <span className="text-sm">
                          {isEnglish ? "Incentive 1" : "ইন্সেন্টিভ ১"}
                        </span>
                        <div className="col-span-3">
                          <Select
                            className="h-20 w-full"
                            options={
                              incentive1Items?.map(
                                ({ value, ...rest }, index) => {
                                  return {
                                    value: value,
                                    label: (
                                      <RewardCard key={index} item={rest} />
                                    ),
                                  };
                                },
                              ) || []
                            }
                            onChange={(e) => {
                              return (
                                setSelectedIncentive1(e.value),
                                setSelectedIncentivePhoto1(
                                  e.image.uri.split(URLS?.incentiveMediaURL)[1],
                                )
                              );
                            }}
                          />
                        </div>
                      </label>
                      <label className="grid cursor-pointer grid-cols-4 items-center gap-2">
                        <span className="text-sm">
                          {isEnglish ? "Incentive 2" : "ইন্সেন্টিভ ২"}
                        </span>
                        <div className="col-span-3">
                          <Select
                            className="h-20 w-full"
                            options={
                              incentive2Items?.map(
                                ({ value, ...rest }, index) => {
                                  return {
                                    value: value,
                                    label: (
                                      <RewardCard key={index} item={rest} />
                                    ),
                                  };
                                },
                              ) || []
                            }
                            onChange={(e) => {
                              return (
                                setSelectedIncentive2(e.value),
                                setSelectedIncentivePhoto2(
                                  e.image.uri.split(URLS?.incentiveMediaURL)[1],
                                )
                              );
                            }}
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                  {isEditable && (
                    <div className="text-right">
                      <Button
                        onClick={() => handleAddSubmit()}
                        isLoading={isLoading}
                      >
                        Submit
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Modal isOpen={isModalOpen} setOpen={setIsModalOpen}>
        <ModalBackdrop />
        <ModalContent
          ModalContent
          className="border-none bg-transparent px-container-inset"
        >
          <div className="w-full">
            <div className="flex items-center justify-between gap-4">
              <div></div>
              <ModalCloseTrigger />
            </div>
            <div>
              <>
                <div className="space-y-2">
                  <span className="block font-semibold text-primary">
                    {isEnglish
                      ? "Select Incentive"
                      : "ইন্সেন্টিভ নির্বাচন করুন"}
                  </span>
                  <div className="space-y-2">
                    <label className="grid cursor-pointer grid-cols-4 items-center gap-2">
                      <span className="text-sm">
                        {isEnglish ? "Incentive 1" : "ইন্সেন্টিভ ১"}
                      </span>
                      <div className="col-span-3">
                        <Select
                          className="h-20 w-full"
                          options={
                            incentive1Items?.map(
                              ({ value, ...rest }, index) => {
                                return {
                                  value: value,
                                  label: <RewardCard key={index} item={rest} />,
                                };
                              },
                            ) || []
                          }
                          onChange={(e) => {
                            return (
                              setSelectedIncentive1(e.value),
                              setSelectedIncentivePhoto1(
                                e.image.uri.split(URLS?.incentiveMediaURL)[1],
                              )
                            );
                          }}
                        />
                      </div>
                    </label>
                    <label className="grid cursor-pointer grid-cols-4 items-center gap-2">
                      <span className="text-sm">
                        {isEnglish ? "Incentive 2" : "ইন্সেন্টিভ ২"}
                      </span>
                      <div className="col-span-3">
                        <Select
                          className="h-20 w-full"
                          options={
                            incentive2Items?.map(
                              ({ value, ...rest }, index) => {
                                return {
                                  value: value,
                                  label: <RewardCard key={index} item={rest} />,
                                };
                              },
                            ) || []
                          }
                          onChange={(e) => {
                            return (
                              setSelectedIncentive2(e.value),
                              setSelectedIncentivePhoto2(
                                e.image.uri.split(URLS?.incentiveMediaURL)[1],
                              )
                            );
                          }}
                        />
                      </div>
                    </label>
                  </div>
                </div>
                {isEditable && (
                  <div className="text-right">
                    <Button
                      isLoading={isLoading}
                      onClick={() => handleEditSubmit()}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RewardPage;
