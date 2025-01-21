import { useCallback, useRef, useState } from "react";

const useCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photo = canvas.toDataURL("image/png");
    setCapturedPhoto(photo);
  }, []);

  //   const capturePhoto = useCallback(() => {
  //     if (!videoRef.current) return;

  //     const video = videoRef.current;

  //     // Dynamically create a canvas element
  //     const canvas = document.createElement("canvas");
  //     canvas.style.display = "none"; // Ensure it's not visible

  //     canvas.width = video.videoWidth;
  //     canvas.height = video.videoHeight;

  //     const context = canvas.getContext("2d");
  //     context.drawImage(video, 0, 0, canvas.width, canvas.height);

  //     // Convert canvas content to a data URL
  //     const photo = canvas.toDataURL("image/png");
  //     setCapturedPhoto(photo);

  //     // Clean up the canvas element after use
  //     canvas.remove();
  //   }, []);

  return {
    videoRef,
    canvasRef,
    isCameraOn,
    capturedPhoto,
    setIsCameraOn,
    setCapturedPhoto,
    startCamera,
    stopCamera,
    capturePhoto,
  };
};

export default useCamera;
