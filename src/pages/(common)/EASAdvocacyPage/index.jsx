import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import Select from "@/components/ui/Select";
import TagInput from "@/components/ui/TagInput";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import axios from "axios";
import { useLayoutEffect, useState } from "react";

const EASAdvocacyPage = () => {
  const { isEnglish } = useLanguageState();
  const { user, userInfo } = useAuthenticationState();

  const [isLoading, setIsLoading] = useState(false);

  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState({});

  const [outletDetails, setOutletDetails] = useState({});

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState({});

  const [consumerNumbers, setConsumerNumbers] = useState([]);

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
            // const pcm = data?.target?.deployedPCM;
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
    const getEasEntry = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(URLS?.baseURL + `/api/eas/brand`);

        if (response?.status === 200) {
          setBrands(
            response?.data?.map((item) => {
              return { label: item?.name, value: item._id, ...item };
            }) || [],
          );
        }
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getEasEntry();
  }, []);

  const handleSubmit = async () => {
    if (!selectedOutlet?.value || !selectedBrand?._id || !consumerNumbers)
      return;

    try {
      setIsLoading(true);

      const payload = JSON.stringify({
        currentBrand: selectedBrand?._id,
        consumerNumbers: consumerNumbers,
      });
      var requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      };
      const response = await fetch(
        URLS?.baseURL + `/api/eas/entry?code=${selectedOutlet?.value}`,
        requestOptions,
      );

      const data = await response.json();
      if (data.status === 200) {
        setSelectedBrand({});
        setConsumerNumbers([]);
      } else {
        alert(JSON.stringify(response.message));
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error?.message;
      alert(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

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
                ? "The brand that is contacted to EAS"
                : "যে ব্র্যান্ডের EAS কে কন্টাক্ট করা হয়েছে"}
            </span>
            <div>
              <label className="grid cursor-pointer grid-cols-4 items-center gap-2">
                <span className="text-sm">
                  {isEnglish ? "Brands" : "ব্রান্ডস"}
                </span>
                <Select
                  className="col-span-3"
                  value={selectedBrand}
                  options={brands || []}
                  onChange={(item) => {
                    setSelectedBrand(item);
                  }}
                />
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <span className="block font-semibold text-primary">
              {isEnglish ? "Consumer Number" : "কনসিউমার নম্বর"}
            </span>
            <TagInput inputs={consumerNumbers} setInputs={setConsumerNumbers} />
          </div>
          <div className="text-right">
            <Button
              onClick={handleSubmit}
              disabled={
                !selectedOutlet?.value ||
                !selectedBrand?._id ||
                !consumerNumbers
              }
              isLoading={isLoading}
            >
              Submit
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EASAdvocacyPage;
