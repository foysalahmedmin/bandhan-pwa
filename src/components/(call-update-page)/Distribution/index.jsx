import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Distribution = ({ outletCode, salesPoint }) => {
  const navigate = useNavigate();
  const { isEnglish } = useLanguageState();
  const { userInfo } = useAuthenticationState();
  const [disStatus, setDisStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfLink, setPdfLink] = useState(null);

  const getDistStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = `${URLS?.baseURL_Server2}/api/getDistStatus?outletCode=${outletCode}`;
      const response = await axios.get(url);
      setIsLoading(false);
      setDisStatus(response?.data?.message);
      setPdfLink(response?.data?.pdfUrl);
    } catch (error) {
      setIsLoading(false);
    }
  }, [outletCode]);

  useEffect(() => {
    getDistStatus();
    if (outletCode) {
      getDistStatus();
    }
  }, [getDistStatus, userInfo.outletCode, outletCode]);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-primary"></div>
        </div>
      ) : (
        <>
          {outletCode && (
            <>
              <div className="rounded-lg bg-primary p-3 text-center">
                <button
                  onClick={() =>
                    navigate("/distribution-status", {
                      state: { pdfLink, disStatus },
                    })
                  }
                  className="text-white"
                >
                  {isEnglish
                    ? "Press to check reword distribution status"
                    : "রিওয়ার্ড ডিশটিবিউশন স্ট্যাটাস দেখতে প্রেস করুন"}
                </button>
              </div>
              {!pdfLink && (
                <div className="mt-3 rounded-lg bg-primary p-3 text-center">
                  <button
                    onClick={() =>
                      navigate("/distribution-incentive", {
                        state: { outletCode, salesPoint },
                      })
                    }
                    className="text-white"
                  >
                    {isEnglish
                      ? "Reword Distribution Acknowledgement"
                      : "রিওয়ার্ড ডিস্ট্রিবিউশন একনলেজমেন্ট"}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Distribution;
