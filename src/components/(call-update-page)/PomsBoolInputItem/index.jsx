import CameraModal from "@/components/partials/Modals/CameraModal";
import { useLocation } from "@/components/providers/LocationProvider";
import { Button } from "@/components/ui/Button";
import { Radio } from "@/components/ui/Radio";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import { useCallback, useState } from "react";

const PomsBoolInputItem = ({
  item,
  imagePath,
  outletCode,
  outletName,
  randomNumber,
  updatePomsBool,
  updatePomsBoolPhotos,
}) => {
  const { isEnglish } = useLanguageState();
  const { userInfo } = useAuthenticationState();
  const { location } = useLocation();

  const [inputValue, setInputValue] = useState(null);
  const [image, setImage] = useState("");
  const [showCameraModal, setShowCameraModal] = useState(false);

  const [visibleImage, setVisibleImage] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSetImage = useCallback(
    (image) => {
      setImage(image);
      updatePomsBoolPhotos(item.key, image);
    },
    [item.key, updatePomsBoolPhotos],
  );

  const imageURL = URLS.baseMediaURL + imagePath;

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="inline-block flex-1 text-sm font-medium">
            {item?.name}
          </span>
          <div className="flex items-center gap-2">
            {image && (
              <div
                onClick={() => {
                  setVisibleImage(image);
                  setVisible(true);
                }}
                className="flex size-6 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-primary"
              >
                <img
                  src={image}
                  alt="Selected"
                  className="size-full object-contain object-center"
                />
              </div>
            )}
            <div
              onClick={() => {
                setVisibleImage(imageURL);
                setVisible(true);
              }}
              className="flex size-6 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-primary"
            >
              <img
                src={imageURL}
                alt="POSM"
                className="size-full object-contain object-center"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <Radio
              type="radio"
              name={`posm-${item?.key}`}
              className="text-primary"
              checked={inputValue === true}
              onChange={() => {
                setInputValue(true);
                updatePomsBool(item?.key, true);
              }}
            />
            {isEnglish ? "Yes" : "হ্যাঁ"}
          </label>
          <label className="flex items-center gap-1">
            <Radio
              type="radio"
              name={`posm-${item?.key}`}
              className="text-primary"
              checked={inputValue === false}
              onChange={() => {
                setInputValue(false);
                updatePomsBool(item?.key, false);
              }}
            />
            {isEnglish ? "No" : "না"}
          </label>
        </div>
        {item?.key === randomNumber && (
          <Button
            type="button"
            size="sm"
            onClick={() => setShowCameraModal(true)}
            className="w-full text-xs"
          >
            Take Photo
          </Button>
        )}
      </div>
      <CameraModal
        isOpen={showCameraModal}
        setIsOpen={setShowCameraModal}
        setImage={handleSetImage}
        title={isEnglish ? "Proof Photo" : "প্রমাণ ছবি"}
        texts={[
          `TMS: ${userInfo?.name}`,
          `Outlet Code: ${outletCode}`,
          `Outlet Name: ${outletName}`,
          `Territory: ${userInfo?.territory[0]?.name}`,
          `Latitude: ${location?.latitude} Longitude: ${location?.longitude}`,
          `Date: ${new Date().toISOString().replace("T", " ").split(".")[0]}`,
        ]}
      />
      {/* Modals */}
      {visible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setVisible(false)}
        >
          <img
            src={visibleImage}
            alt="Modal"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </>
  );
};

export default PomsBoolInputItem;
