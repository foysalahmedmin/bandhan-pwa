import { useCallback, useRef, useState } from "react";

const useCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraType, setCameraType] = useState("user");
  const streamRef = useRef(null);

  const startCamera = useCallback(async (type = "user") => {
    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: {
          facingMode: type,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOn(true);
        setCameraType(type);
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);

      // Fallback to basic constraints if specific facingMode fails
      if (error.name === "OverconstrainedError") {
        console.log("Trying with basic constraints...");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setIsCameraOn(true);
            // We don't know which camera we got, so set to user as default
            setCameraType("user");
          }
        } catch (fallbackError) {
          console.error("Fallback camera access failed:", fallbackError);
        }
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  }, []);

  const switchCamera = useCallback(() => {
    if (!isCameraOn) return;
    const newCameraType = cameraType === "user" ? "environment" : "user";
    startCamera(newCameraType);
  }, [isCameraOn, cameraType, startCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    // Use the existing canvasRef if available, otherwise create a temporary one
    const canvas = canvasRef.current || document.createElement("canvas");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photo = canvas.toDataURL("image/png");
    setCapturedPhoto(photo);

    // If we created a temporary canvas, clean it up
    if (!canvasRef.current) {
      canvas.remove();
    }
  }, []);

  const getAvailableCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((device) => device.kind === "videoinput");
    } catch (error) {
      console.error("Error enumerating devices:", error);
      return [];
    }
  }, []);

  return {
    videoRef,
    canvasRef,
    isCameraOn,
    capturedPhoto,
    cameraType,
    setIsCameraOn,
    setCapturedPhoto,
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    getAvailableCameras,
  };
};

export default useCamera;
