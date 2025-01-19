import { Button } from "@/components/ui/Button";
import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/Modal";
import URLS from "@/constants/urls";
import axios from "axios";
import { PlayCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../../Loading";

const PannelCard = ({ item, index }) => {
  const [isOpen, setInOpen] = useState(false);

  const [modalItem, setModalItem] = useState({});
  const [storedData, setStoredData] = useState({});
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const filePath = URLS.baseMediaURL + item?.file;
  const dateData = new Date(item?.date);
  const dateString = dateData.toDateString();
  const timeString = dateData.toLocaleTimeString();

  useEffect(() => {
    const checkIfDownloaded = () => {
      const downloaded = localStorage.getItem(item?.file);
      const data = downloaded ? JSON.parse(downloaded) : null;

      if (data) {
        if (data?.fileType === "mp4" && data?.file) {
          const blob = data?.file;
          const url = URL.createObjectURL(blob);
          setStoredData({ file: url, fileType: item?.fileType });
        } else {
          setStoredData(data);
        }
      } else {
        setShowDownloadBtn(true);
      }
    };
    checkIfDownloaded();
  }, [item?.file]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await axios.get(filePath, { responseType: "blob" });
      const blob = response?.data;
      const url = URL.createObjectURL(blob);

      // Store the blob URL in localStorage
      localStorage.setItem(
        item?.file,
        JSON.stringify({ file: blob, fileType: item?.fileType }),
      );

      setStoredData({ file: url, fileType: item?.fileType });
      setShowDownloadBtn(false);
      setIsDownloading(false);
      alert(
        `${item?.fileType === "mp4" ? "Video" : "Image"} downloaded successfully.`,
      );
    } catch (error) {
      console.error("Download failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = () => {
    setInOpen(true);
    setModalItem(storedData);
  };

  return (
    <div className="flex w-full items-center justify-between gap-4 border-b border-primary py-4 last:border-b-0">
      <p className="text-lg font-bold">{index + 1}.</p>
      <div>
        {item?.fileType === "png" || item?.fileType === "jpg" ? (
          <img
            src={filePath}
            alt="Preview"
            className="h-20 w-20 rounded border border-primary"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded border border-primary">
            <PlayCircle className="text-4xl text-primary" />
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-primary">{item?.name}</p>
        <p className="text-xs font-semibold text-muted-foreground">{`${dateString} ${timeString}`}</p>
      </div>
      <div>
        {showDownloadBtn ? (
          <Button
            className=""
            onClick={handleDownload}
            isLoading={isDownloading}
            loading="right"
          >
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        ) : (
          <Button onClick={handleView}>
            {storedData?.fileType === "png" || storedData?.fileType === "jpg"
              ? "View"
              : "Play"}
          </Button>
        )}
      </div>

      {isOpen && (
        <Modal isOpen={isOpen}>
          <ModalBackdrop />
          <ModalContent className="border-none bg-transparent px-container-inset">
            <div className="rounded-md bg-card px-4 py-6">
              <div className="space-y-4">
                <div className="mx-auto h-64 w-full max-w-96 rounded-md bg-dark">
                  {modalItem?.fileType === "png" ||
                  modalItem?.fileType === "jpg" ? (
                    <img
                      src={modalItem?.file}
                      alt="Modal Content"
                      className="mx-auto h-full max-h-full max-w-full object-cover object-center"
                    />
                  ) : (
                    <video
                      src={modalItem?.file}
                      controls
                      className="mx-auto h-full max-h-full max-w-full rounded border"
                    ></video>
                  )}
                </div>
                <div className="text-right">
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => setInOpen(false)}
                  >
                    <X className="size-4" /> Close
                  </Button>
                </div>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}

      {isDownloading && (
        <Modal isOpen={isDownloading}>
          <ModalBackdrop />
          <ModalContent className="border-none bg-transparent px-container-inset">
            <div className="rounded-md bg-card px-4 py-6">
              <div className="space-y-4">
                <p className="text-lg font-semibold">Downloading...</p>
                <div className="text-center">
                  <Loading />
                </div>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default PannelCard;
