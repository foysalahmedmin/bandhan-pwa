import BrandSplitSection from "@/components/partials/Sections/BrandSplitSection";
import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import Select from "@/components/ui/Select";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import moment from "moment";
import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    question: "আপনি ভালো আছেন?",
    notes:
      "উত্তর হ্যাঁ হলে, টিএমএস পরের প্রশ্নে যাবে। উত্তর না হলে, টিএমএস ধন্যবাদ দিয়ে পরের সাক্ষাতের জন্য সময় নিয়ে নিবে এবং জরীপ শেষ করবে",
    response_types: ["option"],
    options: ["Yes", "No"],
  },
  {
    question: "আপনি কি জনাব নাসির উদ্দিন?",
    notes: "প্রতিনিধি নোট করবে এবং পরবর্তী প্রশ্নে চলে যাবে",
    response_types: ["option"],
    options: ["Yes", "No"],
  },
  {
    question:
      "বিসমিল্লাহ জেনারেল স্টোর (আউটলেট এর নাম) টিতে আপনি কি ভুমিকায় আছেন?",
    notes: "প্রতিনিধি নোট করবে এবং পরবর্তী প্রশ্নে চলে যাবে",
    response_types: ["option"],
    options: [
      "দোকানের মালিক",
      "দোকান পরিচালনাকারী (যিনি কেনা-বেচা করেন)",
      "দোকানের মালিক ও দোকান পরিচালনা",
      "অন্যান্য",
    ],
  },
  {
    question: "আপনি কি বন্ধন প্রোগ্রামে যুক্ত আছেন?",
    notes: "প্রতিনিধি নোট করবে এবং পরবর্তী প্রশ্নে চলে যাবে",
    response_types: ["option"],
    options: ["Yes", "No"],
  },
  {
    question: "আপনি বন্ধনের পাশাপাশি অন্য কোন প্রোগ্রামে যুক্ত আছেন?",
    notes: "প্রতিনিধি নোট করবে এবং পরবর্তী প্রশ্নে চলে যাবে",
    response_types: ["option"],
    options: ["Yes", "No"],
  },
  {
    question: "আপনার দোকানে বর্তমানে কি কি ব্র্যান্ডের সিগারেট আছে?",
    notes: "প্রতিনিধি নোট করবে এবং পরবর্তী প্রশ্নে চলে যাবে",
    response_types: ["multiple-option"],
    options: [
      "Camel",
      "Sheikh",
      "Navy",
      "Navy Option",
      "K2",
      "Real",
      "Benson",
      "Gold Leaf",
      "Lucky Strike",
      "Star",
      "Derby",
      "Hollywood",
      "Pilot",
      "Sunmoon",
      "Marise",
      "Marlboro",
      "Others",
    ],
  },
  {
    question: "আপনার দোকানে সব থেকে বেশি বিক্রয় হয় কোন ব্র্যান্ডের সিগারেট?",
    notes: "প্রতিনিধি নোট করবে এবং পরবর্তী প্রশ্নে চলে যাবে",
    response_types: ["option"],
    options: [
      "Camel",
      "Sheikh",
      "Navy",
      "Navy Option",
      "K2",
      "Real",
      "Benson",
      "Gold Leaf",
      "Lucky Strike",
      "Star",
      "Derby",
      "Hollywood",
      "Pilot",
      "Sunmoon",
      "Marise",
      "Marlboro",
      "Others",
    ],
  },
  {
    question:
      "আপনার মতে উল্লেখিত সিগারেটটির কোন দিকটি সবচেয়ে বেশি ভালো লেগেছে। যার জন্য তার বিক্রয় বেশি হচ্ছে।",
    notes: "প্রতিনিধি নোট করবে এবং পরবর্তী প্রশ্নে চলে যাবে",
    response_types: ["option"],
    options: [
      "Taste",
      "Pack design",
      "Campaign/communication",
      "Like the flavor",
      "Stick design",
      "Like it after capsule burst",
      "Less draw effort/easy to draw",
      "Strong filter construct",
      "No irritation in throat",
      "Like the capsule flavor",
      "Liked the taste",
      "Liked the smell",
      "Other",
      "Did not like anything in particular",
    ],
  },
  {
    question: "উল্লেখিত সিগারেটটি কি আপনার দোকানে সবসময় পাওয়া যায়?",
    notes: "প্রতিনিধি নোট করবে এবং পরবর্তী প্রশ্নে চলে যাবে",
    response_types: ["option"],
    options: ["Yes", "No"],
  },
  {
    question: "আপনার দোকানে সব থেকে কম বিক্রয় হয় কোন ব্র্যান্ডের সিগারেট?",
    notes: "প্রতিনিধি নোট করবে এবং পরবর্তী প্রশ্নে চলে যাবে",
    response_types: ["option"],
    options: [
      "Camel",
      "Sheikh",
      "Navy",
      "Navy Option",
      "K2",
      "Real",
      "Benson",
      "Gold Leaf",
      "Lucky Strike",
      "Star",
      "Derby",
      "Hollywood",
      "Pilot",
      "Sunmoon",
      "Marise",
      "Marlboro",
      "Others",
    ],
  },
  {
    question:
      "আপনার মতে উল্লেখিত সিগারেটটির কোন দিকটি সবচেয়ে বেশি খারাপ লেগেছে। যার জন্য তার বিক্রয় কম হচ্ছে।",
    notes: "প্রতিনিধি নোট করবে এবং পরবর্তী প্রশ্নে চলে যাবে",
    response_types: ["option"],
    options: [
      "Amount of smoke",
      "Can not draw easily",
      "Filter gets damp",
      "Irritation in throat",
      "Cigarette burns fast",
      "Did not like the taste",
      "Did not like the design",
      "Did not like the smell",
      "Too strong",
      "Did not like the capsule flavor",
      "Did not like after capsule burst",
      "Stick Design",
      "Others",
      "Did not dislike anything in particular",
    ],
  },
];
const OutletSurveyPage = () => {
  const { isEnglish } = useLanguageState();
  const { user, userInfo } = useAuthenticationState();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState({});

  const [outletDetails, setOutletDetails] = useState({});

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
                navigate(`/communication-video`, {
                  state: {
                    outletCode: outletDetails?.code,
                    outletName: outletDetails?.name,
                    communication: outletDetails?.communication?.file,
                    salesPoint: selectedOutlet,
                  },
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

export default OutletSurveyPage;
