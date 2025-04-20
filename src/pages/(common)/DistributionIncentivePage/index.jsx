import CameraModal from "@/components/partials/Modals/CameraModal";
import RootLoading from "@/components/partials/RootLoading.jsx";
import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import {
  Modal,
  ModalBackdrop,
  ModalCloseTrigger,
  ModalContent,
} from "@/components/ui/Modal";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import axios from "axios";
import { Camera, FileSignature as Signature, X } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SignaturePad from "react-signature-canvas";

export default function DistributionIncentivePage() {
  const { isEnglish } = useLanguageState();
  const location = useLocation();
  const { outletCode, salesPoint } = location?.state || {};
  const { userInfo } = useAuthenticationState();

  const [isLoading, setIsLoading] = useState(false);

  const [distributionData, setDistributionData] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [signature1, setSignature1] = useState(null);
  const [signature2, setSignature2] = useState(null);

  const [showCameraModal1, setShowCameraModal1] = useState(false);
  const [showCameraModal2, setShowCameraModal2] = useState(false);
  const [showSignatureModal1, setShowSignatureModal1] = useState(false);
  const [showSignatureModal2, setShowSignatureModal2] = useState(false);
  const [verifyOtpModal, setVerifyOtpModal] = useState(false);

  const [otp, setOtp] = useState("");
  const [submitOtpLoading, setSubmitOtpLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const getDistributionData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          URLS?.baseURL_Server2 + "/api/outlet-target-retailer/" + outletCode,
        );
        if (response.status === 200) {
          setDistributionData(response.data);
        }
      } catch (error) {
        console.error("Error fetching distribution data:", error);
        alert("Failed to fetch distribution data");
      } finally {
        setIsLoading(false);
      }
    };

    getDistributionData();
  }, [outletCode]);

  const handleCameraCapture = (setImage) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleVerifyRetailer = async () => {
    if (!image1 || !image2 || !signature1 || !signature2) {
      alert(isEnglish ? "Please fill all fields" : "সব ক্ষেত্র পূরণ করুন");
      return;
    }

    setSubmitOtpLoading(true);
    try {
      const response = await axios.post(
        URLS?.baseURL_Server2 + "/api/verifyRetailer",
        {
          phone: distributionData?.phone,
        },
      );

      if (response?.status === 200) {
        setVerifyOtpModal(true);
      }
    } catch (error) {
      console.error("Error verifying retailer:", error);
      alert(
        isEnglish
          ? "Failed to verify retailer"
          : "রিটেইলার যাচাই ব্যর্থ হয়েছে",
      );
    } finally {
      setSubmitOtpLoading(false);
    }
  };

  const handleDistributionSubmit = async () => {
    setSubmitLoading(true);
    try {
      const payload = {
        region: userInfo?.region[0]?.name,
        area: userInfo?.area[0]?.name,
        retailerName: distributionData?.name + "",
        retailerPhone: distributionData?.phone,
        retailerAddress: distributionData?.address,
        outletCode: outletCode,
        storeName: distributionData?.storeName,
        sales: distributionData?.totalSales,
        incentivesOne: distributionData?.incentivesOne,
        incentivesTwo: distributionData?.incentivesTwo,
        location: `${location?.latitude}, ${location?.longitude}`,
        territory: userInfo?.territory[0]?.name,
        salesPoint: salesPoint?.salesPoint?.name,
        proofPhotoOne: image1,
        proofPhotoTwo: image2,
        retailerSign: signature1,
        tmsSign: signature2,
        tms: userInfo.name,
        typedOtp: otp,
        createdAt: moment(new Date()).format("YYYY-MM-DD"),
      };
      const response = await axios.post("/api/verifyOTP", payload);

      if (response.data.message === "OTP Verified And Data Saved") {
        alert(
          isEnglish
            ? "OTP Verified And Data Saved"
            : "ওটিপি যাচাই এবং ডেটা সংরক্ষিত হয়েছে",
        );
        setVerifyOtpModal(false);
        // Reset form
        setImage1(null);
        setImage2(null);
        setSignature1(null);
        setSignature2(null);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting distribution:", error);
      alert(
        isEnglish
          ? "Failed to submit distribution"
          : "বিতরণ জমা দিতে ব্যর্থ হয়েছে",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <RootLoading />
      </>
    );
  }

  return (
    <main>
      <section className="py-4">
        <div className="container">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="block font-semibold text-primary">
                {isEnglish
                  ? "Incentive Distribution"
                  : "ইন্সেন্টিভ ডিস্ট্রিবিউশন"}
              </span>
            </div>

            {distributionData && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <InfoField
                    label={isEnglish ? "TMS Name" : "টিএমএস নাম"}
                    value={distributionData.name}
                  />
                  <InfoField
                    label={isEnglish ? "Retailer Phone" : "রিটেইলার ফোন"}
                    value={distributionData.phone}
                  />
                  <InfoField
                    label={isEnglish ? "Retailer Address" : "রিটেইলার ঠিকানা"}
                    value={distributionData.address}
                  />
                  <InfoField
                    label={isEnglish ? "Store Name" : "দোকানের নাম"}
                    value={distributionData.storeName}
                  />
                  <InfoField
                    label={isEnglish ? "Sales Count" : "বিক্রয় সংখ্যা"}
                    value={distributionData.totalSales.toString()}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <ImageUpload
                    label={isEnglish ? "Proof Photo 1" : "প্রমাণ ছবি ১"}
                    image={image1}
                    setImage={setImage1}
                    onOpen={() => setShowCameraModal1(true)}
                    buttonText={isEnglish ? "Take Photo" : "ছবি তুলুন"}
                  />
                  <ImageUpload
                    label={isEnglish ? "Proof Photo 2" : "প্রমাণ ছবি ২"}
                    image={image2}
                    setImage={setImage2}
                    onOpen={() => setShowCameraModal2(true)}
                    buttonText={isEnglish ? "Take Photo" : "ছবি তুলুন"}
                  />
                </div>

                <div className="space-y-2">
                  <SignatureField
                    label={isEnglish ? "TMS Signature" : "টিএমএস স্বাক্ষর"}
                    signature={signature1}
                    onOpen={() => setShowSignatureModal1(true)}
                  />
                  <SignatureField
                    label={
                      isEnglish ? "Retailer Signature" : "রিটেইলার স্বাক্ষর"
                    }
                    signature={signature2}
                    onOpen={() => setShowSignatureModal2(true)}
                  />
                </div>

                <Button
                  onClick={handleVerifyRetailer}
                  isLoading={submitOtpLoading}
                  className="w-full"
                >
                  {isEnglish ? "Verify Retailer" : "রিটেইলার যাচাই করুন"}
                </Button>
              </div>
            )}
          </div>

          {/* Signature Modals */}
          <CameraModal
            isOpen={showCameraModal1}
            setIsOpen={setShowCameraModal1}
            setImage={setImage1}
            title={isEnglish ? "Proof Photo 1" : "প্রমাণ ছবি ১"}
          />

          <CameraModal
            isOpen={showCameraModal2}
            setIsOpen={setShowCameraModal2}
            setImage={setImage2}
            title={isEnglish ? "Proof Photo 1" : "প্রমাণ ছবি ১"}
          />

          {/* Signature Modals */}
          <SignatureModal
            isOpen={showSignatureModal1}
            setIsOpen={setShowSignatureModal1}
            setSignature={setSignature1}
            title={isEnglish ? "TMS Signature" : "টিএমএস স্বাক্ষর"}
          />
          <SignatureModal
            isOpen={showSignatureModal2}
            setIsOpen={setShowSignatureModal2}
            setSignature={setSignature2}
            title={isEnglish ? "Retailer Signature" : "রিটেইলার স্বাক্ষর"}
          />

          {/* OTP Modal */}
          {verifyOtpModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-md bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {isEnglish ? "Verify Retailer" : "রিটেইলার যাচাই"}
                  </h2>
                  <button onClick={() => setVerifyOtpModal(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="block text-sm font-medium">
                      {isEnglish ? "OTP Code" : "ওটিপি কোড"}
                    </span>
                    <FormControl
                      as="input"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder={
                        isEnglish ? "Enter OTP Code" : "ওটিপি কোড লিখুন"
                      }
                    />
                  </label>

                  <Button
                    onClick={handleDistributionSubmit}
                    disabled={submitLoading}
                    isLoading={submitLoading}
                  >
                    {isEnglish ? "Submit" : "জমা দিন"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <FormControl
        as="div"
        className="pointer-events-none col-span-3 h-auto min-h-form-control text-sm"
      >
        {value}
      </FormControl>
    </div>
  );
}

function ImageUpload({ label, image, setImage, onOpen, buttonText }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <button
        onClick={onOpen}
        className="relative flex aspect-square w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-primary/50 bg-primary/25 hover:bg-primary/10"
      >
        {image ? (
          <>
            <img
              src={image}
              alt="Captured"
              className="h-full w-full rounded-md object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImage(null);
              }}
              className="absolute right-2 top-2 text-primary"
            >
              <X className="size-6" />
            </button>
          </>
        ) : (
          <>
            <Camera className="mb-2 size-8 text-primary" />
            <span className="text-sm font-medium text-primary">
              {buttonText}
            </span>
          </>
        )}
      </button>
    </div>
  );
}

function SignatureField({ label, signature, onOpen }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <button
        onClick={onOpen}
        className="flex h-32 w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-primary/50 bg-primary/25 hover:bg-primary/10"
      >
        {signature ? (
          <img
            src={signature}
            alt="Signature"
            className="h-full object-contain"
          />
        ) : (
          <>
            <Signature className="mb-2 h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-primary">{label}</span>
          </>
        )}
      </button>
    </div>
  );
}

function SignatureModal({ isOpen, setIsOpen, setSignature, title }) {
  const { isEnglish } = useLanguageState();
  let signaturePad = null;

  const handleSave = () => {
    if (signaturePad) {
      const signature = signaturePad
        ?.getTrimmedCanvas()
        ?.toDataURL("image/png");
      setSignature(signature);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <ModalBackdrop />
        <ModalContent className="border-none bg-transparent px-container-inset">
          <div className="rounded-md bg-card px-4 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="block flex-1 font-semibold text-primary">
                  {title}
                </span>
                <ModalCloseTrigger className="rounded-full" size="sm" />
              </div>
              <div className="h-96 rounded-md border">
                <SignaturePad
                  ref={(ref) => {
                    signaturePad = ref;
                  }}
                  canvasProps={{ className: "w-full h-full" }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => signaturePad?.clear()}
                  className="secondary"
                >
                  {isEnglish ? "Clear" : "মুছুন"}
                </Button>
                <Button onClick={handleSave}>
                  {isEnglish ? "Save" : "সংরক্ষণ"}
                </Button>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
