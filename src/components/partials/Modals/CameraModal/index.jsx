import { Button } from "@/components/ui/Button";
import {
  Modal,
  ModalBackdrop,
  ModalCloseTrigger,
  ModalContent,
} from "@/components/ui/Modal";
import useCamera from "@/hooks/utils/useCamera";
import { Camera } from "lucide-react";
import { useEffect } from "react";

function CameraModal({
  isOpen,
  setIsOpen,
  setImage,
  title,
  texts = [],
  options = {},
}) {
  const {
    canvasRef,
    videoRef,
    isCameraOn,
    capturedPhoto,
    capturePhoto,
    startCamera,
    stopCamera,
  } = useCamera();

  const handleCapture = () => {
    capturePhoto(texts, options);
    stopCamera();
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    if (capturedPhoto) {
      setImage(capturedPhoto);
    }
  }, [capturedPhoto, isOpen]);

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
                <ModalCloseTrigger
                  onClick={() => stopCamera()}
                  className="rounded-full"
                  size="sm"
                />
              </div>
              <div className="grid h-96 place-items-center rounded-md border">
                <video
                  ref={videoRef}
                  style={{ width: "100%", maxHeight: "100%" }}
                />
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  shape="icon"
                  onClick={handleCapture}
                  disabled={!isCameraOn}
                >
                  <Camera className="size-6" />
                </Button>
              </div>
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CameraModal;
