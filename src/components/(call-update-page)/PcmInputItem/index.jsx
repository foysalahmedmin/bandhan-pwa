import { getPCMRecord } from "@/apis/bandhan/getPCMRecord";
import { Radio } from "@/components/ui/Radio";
import URLS from "@/constants/urls";
import useLanguageState from "@/hooks/state/useLanguageState";
import { useEffect, useState } from "react";
import "react-image-lightbox/style.css";

const PcmInputItem = ({ item, imagePath, outletCode, pcm, setPcm }) => {
  const { isEnglish } = useLanguageState();

  const [previousPCMRecord, setPreviousPCMRecord] = useState({});

  const [visibleImage, setVisibleImage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPCMRecord(outletCode);
      if (res !== undefined && res?.length !== 0) {
        setPreviousPCMRecord(res);
      } else {
        setPreviousPCMRecord(null);
      }
    };
    fetchData();
  }, [outletCode]);

  const imageURL = URLS.baseMediaURL + imagePath;

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="inline-block flex-1 text-sm font-medium">
            {item?.name}
          </span>
          <div className="flex items-center gap-2">
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
              name={`psm-${item?.key}`}
              className="text-primary"
              checked={pcm[item.key] === true}
              onChange={() => {
                const updatedPcm = { ...pcm, [item.key]: true };
                setPcm(updatedPcm);
              }}
            />
            {isEnglish ? "Yes" : "হ্যাঁ"}
          </label>
          <label className="flex items-center gap-1">
            <Radio
              type="radio"
              name={`psm-${item?.key}`}
              className="text-primary"
              checked={pcm[item.key] === false}
              onChange={() => {
                const updatedPcm = { ...pcm, [item.key]: false };
                setPcm(updatedPcm);
              }}
            />
            {isEnglish ? "No" : "না"}
          </label>
          {previousPCMRecord?.[item?.key] && (
            <div style={{ marginLeft: 20 }}>
              <p className="text-sm font-medium text-primary">
                {previousPCMRecord?.[item?.key] === true
                  ? isEnglish
                    ? "Yes"
                    : "হ্যাঁ"
                  : isEnglish
                    ? "No"
                    : "না"}{" "}
                (Previous Record)
              </p>
            </div>
          )}
        </div>
      </div>

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

export default PcmInputItem;
