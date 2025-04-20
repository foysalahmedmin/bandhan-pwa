import { getAllBrands } from "@/apis/bandhan/getAllBrands";
import { getSelectedbrand } from "@/apis/bandhan/getSelectedBrands";
import { pcmData } from "@/assets/data/pcm";
import { pomsDataBool, pomsDataInput } from "@/assets/data/posm";
import Distribution from "@/components/(call-update-page)/Distribution";
import PcmInputItem from "@/components/(call-update-page)/PcmInputItem";
import PomsBoolInputItem from "@/components/(call-update-page)/PomsBoolInputItem";
import PosmInputItem from "@/components/(call-update-page)/PosmInputItem";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormControl } from "@/components/ui/FormControl";
import { Radio } from "@/components/ui/Radio";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import { getRandomNumber } from "@/utils/getRandomNumber";
import axios from "axios";
import { Camera, Check, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CallUpdatePage = () => {
  const routeLocation = useLocation();
  const navigate = useNavigate();

  const { outletCode, outletName, salesPoint } = routeLocation?.state || {};

  const { user } = useAuthenticationState();

  const { isEnglish } = useLanguageState();
  const [successModal, setSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBrandLoading, setIsBrandLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedBrandLoader, setSelectedBrandLoader] = useState(false);
  const [allBrand, setAllBrand] = useState([]);
  const [stock, setStock] = useState([]);
  const [avgSales, setAvgSales] = useState("");
  const [posmVisible, setPosmVisible] = useState("");
  const [topTwoSelling, setTopTwoSelling] = useState([]);
  const [randomNumber, setRandomNumber] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const [pcmImages, setPcmImages] = useState([]);
  const [posmImages, setPosmImages] = useState([]);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const [pcm, setPcm] = useState({
    regularPushCard: null,
    customPushCart: null,
    streetKioskWithStove: null,
    streetKiosk: null,
    groceryCounter: null,
    parasol: null,
    cashCounter1: null,
    cashCounter2: null,
  });

  const [posmInput, setPosmInput] = useState({
    glassPack1: { count: 0, img: "" },
    glassPack2: { count: 0, img: "" },
    packDisplay: { count: 0, img: "" },
    dangler: { count: 0, img: "" },
    pvcFrame: { count: 0, img: "" },
    ironFrame: { count: 0, img: "" },
    newIronFrame: { count: 0, img: "" },
    kioskDisplay: { count: 0, img: "" },
    verticalDisplay: { count: 0, img: "" },
    backWall: { count: 0, img: "" },
    acrylicTable: { count: 0, img: "" },
  });

  const [pomsBool, setPomsBool] = useState({
    kv: { value: false, img: "" },
    plangram: { value: false, img: "" },
    pcmRebranding: { value: false, img: "" },
  });

  useEffect(() => {
    const getImages = async () => {
      try {
        const { data } = await axios.get(URLS.baseURL + "/app/images");
        if (data) {
          setPcmImages(data?.pcm);
          setPosmImages(data?.posm);
        }
      } catch (e) {
        console.error("Error fetching images:", e);
      }
    };
    getImages();
  }, []);

  const updatePomsCount = useCallback((itemName, value) => {
    setPosmInput((prevState) => ({
      ...prevState,
      [itemName]: {
        ...prevState[itemName],
        count: value,
      },
    }));
  }, []);

  const updatePomsPhotos = useCallback((itemName, value) => {
    setPosmInput((prevState) => ({
      ...prevState,
      [itemName]: {
        ...prevState[itemName],
        img: value,
      },
    }));
  }, []);

  const updatePomsBool = useCallback((itemName, value) => {
    setPomsBool((prevState) => ({
      ...prevState,
      [itemName]: {
        ...prevState[itemName],
        value: value,
      },
    }));
  }, []);

  const updatePomsBoolPhotos = useCallback((itemName, value) => {
    setPomsBool((prevState) => ({
      ...prevState,
      [itemName]: {
        ...prevState[itemName],
        img: value,
      },
    }));
  }, []);

  const handleShowLocation = async () => {
    try {
      setShowLocation(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
          },
        );
      }
    } catch (error) {
      console.error("Error showing location:", error);
    }
  };

  const handleTextInputChangeAvg = (e) => {
    const text = e.target.value;
    if (/^\d{0,5}$/.test(text)) {
      setAvgSales(text);
    }
  };

  const fetchSelectedBrandLoader = async () => {
    try {
      setSelectedBrandLoader(true);
      const res = await getSelectedbrand();
      const format = res.map((x) => ({
        brand: x._id,
        count: 0,
      }));
      setSelectedBrand(res);
      setStock(format);
      setSelectedBrandLoader(false);
    } catch (error) {
      console.error("Error fetching selected brands:", error);
    }
  };

  const generateRandomNumber = () => {
    const payload = {
      ...posmInput,
      ...pomsBool,
    };
    setRandomNumber(getRandomNumber(payload));
  };

  const fetchBrandData = async () => {
    setIsBrandLoading(true);
    const response = await getAllBrands();
    setAllBrand(response);
    setIsBrandLoading(false);
  };

  useEffect(() => {
    fetchBrandData();
  }, []);

  useEffect(() => {
    fetchSelectedBrandLoader();
  }, []);

  const handleTextInputChangePoms = (e) => {
    const text = e.target.value;
    const numericValue = parseFloat(text);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 10) {
      setPosmVisible(text);
    } else {
      setPosmVisible("0");
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const url = URLS.baseURL + "/app/callcard";
      const payload = {
        outletCode: outletCode,
        stock,
        pcm: {
          regularPushCard: pcm?.regularPushCard || false,
          customPushCart: pcm?.customPushCart || false,
          streetKioskWithStove: pcm?.streetKioskWithStove || false,
          streetKiosk: pcm?.streetKiosk || false,
          groceryCounter: pcm?.groceryCounter || false,
          parasol: pcm?.parasol || false,
          cashCounter1: pcm?.cashCounter1 || false,
          cashCounter2: pcm?.cashCounter2 || false,
        },
        posm: {
          ...posmInput,
          ...pomsBool,
        },
        avgSales: avgSales ? avgSales : 0,
        topTwoSelling,
        posmVisible: posmVisible ? posmVisible : 0,
        lat: showLocation ? location?.latitude : 0,
        lon: showLocation ? location?.longitude : 0,
      };

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: user,
          "Custom-Key": "some-value",
        },
      });
      if (response.status === 200) {
        setSuccessModal(true);
      }
      setIsLoading(false);
      setLocation({
        latitude: 0,
        longitude: 0,
      });
    } catch (err) {
      console.error("Error submitting data:", err);
      setIsLoading(false);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen">
      <section className="py-4">
        <div className="container space-y-4">
          <>
            {/* Stock Input Section */}
            <div className="rounded-md border border-primary">
              <strong className="block w-full bg-primary py-2 text-center font-semibold text-primary-foreground">
                {isEnglish ? "Stock Input:" : "স্টক ইনপুট:"}
                <span className="block text-sm">
                  {isEnglish
                    ? "(if any brand is Out of Stock or Not Sold, input 0)"
                    : "(যদি কোনো ব্র্যান্ড স্টক পাওয়া যায় না বা বিক্রি না হয়, ইনপুট 0)"}
                </span>
              </strong>

              <div className="p-2">
                {selectedBrandLoader ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedBrand?.map((item, index) => (
                      <label
                        key={index}
                        className="grid cursor-pointer grid-cols-4 items-center gap-2"
                      >
                        <span className="col-span-2 text-sm font-medium leading-none">
                          {item?.name}
                        </span>
                        <FormControl
                          type="number"
                          size="sm"
                          className="col-span-2 text-sm"
                          onChange={(e) => {
                            const newStock = [...stock];
                            newStock[index].count = parseInt(e.target.value);
                            setStock(newStock);
                          }}
                          value={stock[index]?.count || null}
                          placeholder="Enter 0 - 99999"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* POSM Section */}
            <div className="rounded-md border border-primary">
              <strong className="block w-full bg-primary py-2 text-center font-semibold text-primary-foreground">
                {isEnglish ? "Available POSM" : "Available POSM"}
              </strong>

              <div className="p-2">
                <div className="space-y-2">
                  <span className="block text-sm text-primary">
                    {isEnglish
                      ? "After filling in all the input, please press the 'Capture Photo' button and capture a photo in the marked field."
                      : "সমস্ত ইনপুট পূরণ করার পরে অনুগ্রহ করে 'ছবি ক্যাপচার করুন' বোতাম টিপুন এবং চিহ্নিত ক্ষেত্রে একটি ফটো ক্যাপচার করুন৷"}
                  </span>
                  {pomsDataInput?.map((item, index) => (
                    <PosmInputItem
                      key={index}
                      item={item}
                      imagePath={posmImages[item?.id]}
                      outletCode={outletCode}
                      outletName={outletName}
                      randomNumber={randomNumber}
                      updatePomsCount={updatePomsCount}
                      updatePomsPhotos={updatePomsPhotos}
                    />
                  ))}

                  {pomsDataBool?.map((item, index) => (
                    <PomsBoolInputItem
                      key={index}
                      item={item}
                      imagePath={posmImages[item.id]}
                      outletCode={outletCode}
                      outletName={outletName}
                      randomNumber={randomNumber}
                      updatePomsBool={updatePomsBool}
                      updatePomsBoolPhotos={updatePomsBoolPhotos}
                    />
                  ))}

                  {randomNumber === "" && (
                    <Button onClick={generateRandomNumber} className="w-full">
                      <Camera className="size-6" />
                      <span>
                        {isEnglish ? "Capture Photo" : "ছবি ক্যাপচার"}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* PCM Section */}
            <div className="rounded-md border border-primary">
              <strong className="block w-full bg-primary py-2 text-center font-semibold text-primary-foreground">
                {isEnglish
                  ? "What type of PCM does the outlet have?"
                  : "আউটলেটে কি ধরনের PCM আছে?"}
              </strong>
              <div className="p-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {pcmData?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        type="checkbox"
                        id={`pcm-${index}`}
                        className="h-4 w-4 cursor-pointer border-accent"
                        checked={pcm[item.id] || false}
                        onChange={(e) =>
                          setPcm((prev) => ({
                            ...prev,
                            [item.id]: e.target.checked,
                          }))
                        }
                      />
                      <label htmlFor={`pcm-${index}`} className="flex-1">
                        {item.name}
                      </label>
                    </div>
                  ))}

                  {pcmData?.map((item, index) => (
                    <PcmInputItem
                      key={index}
                      item={item}
                      imagePath={pcmImages[index]}
                      outletCode={outletCode}
                      outletName={outletName}
                      pcm={pcm}
                      setPcm={setPcm}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Average Sales Section */}
            <div className="rounded-md border border-primary">
              <strong className="block w-full bg-primary py-2 text-center font-semibold text-primary-foreground">
                {isEnglish
                  ? "Average Competition Sales (in sticks, all brands combined)"
                  : "অ্যাভারেজ কম্পেটিশন বিক্রয় (স্টিক এ, সব ব্র্যান্ডের মিলিত)"}
              </strong>
              <div className="p-2">
                <FormControl
                  type="number"
                  placeholder="Enter value 0 - 99999"
                  className="text-sm"
                  onChange={handleTextInputChangeAvg}
                  value={avgSales}
                />
              </div>
            </div>

            {/* Top Selling Brands Section */}
            <div className="rounded-md border border-primary">
              <strong className="block w-full bg-primary py-2 text-center font-semibold !leading-tight text-primary-foreground">
                {isEnglish
                  ? "2 Top Selling Brand of Competition: (Check 2 Boxes)"
                  : "কম্পেটিশন এর 2টি টপ বিক্রি হওয়া ব্র্যান্ড: (2টি বাক্সে চেক করুন)"}
              </strong>
              <div className="p-2">
                {isBrandLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {allBrand?.map((item, index) => (
                      <label key={index} className="flex items-center gap-2">
                        <Radio
                          type="checkbox"
                          checked={topTwoSelling.includes(item._id)}
                          onChange={(e) => {
                            if (e.target.checked && topTwoSelling.length < 2) {
                              setTopTwoSelling([...topTwoSelling, item._id]);
                            } else if (!e.target.checked) {
                              setTopTwoSelling(
                                topTwoSelling.filter((id) => id !== item._id),
                              );
                            }
                          }}
                        />
                        <span className="font-medium">{item?.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Competition POSM Section */}
            <div className="rounded-md border border-primary">
              <strong className="block w-full bg-primary py-2 text-center font-semibold text-primary-foreground">
                {isEnglish
                  ? "How many competition POSMs are visible?"
                  : "কয়টি কম্পেটিশন POSM ভিসিবল?"}
              </strong>
              <div className="p-2">
                <FormControl
                  type="number"
                  placeholder="Enter value 0-10"
                  className="text-sm"
                  value={posmVisible}
                  onChange={handleTextInputChangePoms}
                />
              </div>
            </div>

            {/* Competition POSM Section */}
            <div className="rounded-md border border-primary">
              <strong className="block w-full bg-primary py-2 text-center font-semibold text-primary-foreground">
                {isEnglish
                  ? "Reward Distribution Status"
                  : "রিওয়ার্ড ডিস্ট্রিবিউশন স্ট্যাটাস"}
              </strong>
              <div className="p-2">
                <Distribution outletCode={outletCode} salesPoint={salesPoint} />
              </div>
            </div>

            {/* Location Section */}
            <div className="rounded-md border border-primary">
              <strong className="block w-full bg-primary py-2 text-center font-semibold text-primary-foreground">
                {isEnglish ? "Location" : "লোকেশন"}
              </strong>
              <div className="p-2">
                <div className="space-y-2">
                  {showLocation && (
                    <div className="space-y-2 text-primary">
                      <p>
                        <span className="font-medium">Latitude:</span>{" "}
                        {location.latitude}
                      </p>
                      <p>
                        <span className="font-medium">Longitude:</span>{" "}
                        {location.longitude}
                      </p>
                    </div>
                  )}
                  <Button
                    onClick={handleShowLocation}
                    className="h-auto min-h-button w-full flex-wrap whitespace-normal py-1"
                  >
                    <span>
                      {isEnglish
                        ? "Add Location (Latitude and Longitude)"
                        : "আপনার লোকেশন ক্যাপচার করতে এখানে প্রেস করুন"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button onClick={handleSubmit} isLoading={isLoading}>
                <span>{isEnglish ? "Submit" : "সাবমিট"}</span>
              </Button>
            </div>

            {/* Success Modal */}
            {successModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="m-4 w-full max-w-md rounded-lg bg-white p-8">
                  <div className="text-center">
                    <Check className="mx-auto mb-4 h-16 w-16 text-green-500" />
                    <span className="mb-2 text-xl font-bold">
                      {isEnglish ? "Submit Success" : "সাবমিট সাকসেস"}
                    </span>
                    <p className="mb-4 text-gray-600">
                      {isEnglish
                        ? "Your feedback has been successfully submitted."
                        : "আপনার ফিডব্যাক সফলভাবে জমা দেওয়া হয়েছে."}
                    </p>
                    <button
                      className="hover:bg-primary-dark rounded-lg bg-primary px-4 py-2 text-white transition-colors"
                      onClick={() => {
                        setSuccessModal(false);
                        navigate(`/`, {
                          replace: true,
                        });
                      }}
                    >
                      {isEnglish ? "Close" : "বন্ধ করুন"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </section>
    </div>
  );
};

export default CallUpdatePage;
