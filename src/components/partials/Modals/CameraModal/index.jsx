import { Button } from "@/components/ui/Button";
import {
  Modal,
  ModalBackdrop,
  ModalCloseTrigger,
  ModalContent,
} from "@/components/ui/Modal";
import useCamera from "@/hooks/utils/useCamera";
import { Camera, Repeat } from "lucide-react";
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
    switchCamera,
    cameraType,
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
          <div className="rounded-md bg-card">
            <div className="flex h-[80vh] flex-col space-y-4 px-4 py-6">
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

              <div className="relative grid grow place-items-center overflow-hidden rounded-md border">
                <video
                  ref={videoRef}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
                <Button
                  onClick={switchCamera}
                  // disabled={!isCameraOn}
                  className="absolute bottom-2 right-2 flex items-center gap-2 rounded bg-background/70 px-2 py-1 text-xs text-muted-foreground"
                  variant="none"
                >
                  <span>
                    {cameraType === "user" ? "Front Camera" : "Back Camera"}
                  </span>
                  <span>
                    <Repeat className="size-4" />
                  </span>
                </Button>
              </div>

              <div className="flex justify-center gap-2">
                <Button onClick={handleCapture} disabled={!isCameraOn}>
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
