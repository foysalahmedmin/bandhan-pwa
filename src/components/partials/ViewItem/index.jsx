import { getCurrentCommunication } from "@/apis/bandhan/getCurrentCommunication";
import { Button } from "@/components/ui/Button";
import URLS from "@/constants/urls";
import useLanguageState from "@/hooks/state/useLanguageState";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewItem({ state }) {
  const navigate = useNavigate();
  const { isEnglish } = useLanguageState();
  const [isLoading, setIsLoading] = useState(false);

  const [type, setType] = useState(null);
  const [data, setData] = useState({});
  const [timer, setTimer] = useState(1);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [play, setPlay] = useState(true);

  const handleSkip = () => {
    setPlay(false);
    navigate(`/call-update`, {
      replace: true,
      state: state || {},
    });
  };

  const fetchView = async () => {
    try {
      const res = await getCurrentCommunication();
      setData(res);
      setType(res.type);
    } catch (error) {
      console.log("Error fetching communication:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchView();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(intervalId);
          setShowSkipButton(true);
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-md border border-primary">
      <div className="w-full bg-primary text-center text-primary-foreground">
        <strong className="w-full py-2 text-primary-foreground">
          {isEnglish ? "View" : "দেখুন"}
        </strong>
      </div>

      {play && (
        <div className="space-y-2 p-2">
          <div className="mx-auto aspect-square max-h-80 max-w-full rounded-md bg-dark">
            {(() => {
              switch (type) {
                case "Video":
                  return (
                    <video
                      className="mx-auto h-full max-h-full max-w-full"
                      controls
                      src={URLS.baseMediaURL + data?.file}
                    />
                  );
                case "Audio":
                  return (
                    <audio
                      controls
                      className="mx-auto h-full max-h-full max-w-full"
                      src={URLS.baseMediaURL + data?.file}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  );
                case "Photo":
                  return (
                    <img
                      src={URLS?.baseMediaURL + data?.file}
                      alt="Media Content"
                      className="mx-auto h-full max-h-full max-w-full object-cover object-center"
                    />
                  );
                default:
                  return <></>;
              }
            })()}
          </div>

          <div className="text-right">
            {showSkipButton ? (
              <Button onClick={handleSkip}>
                {isEnglish ? "Skip" : "স্কিপ"}
              </Button>
            ) : (
              <Button disabled>{timer}s</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
