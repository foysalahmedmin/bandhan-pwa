import { useCallback, useEffect, useRef, useState } from "react";

const useCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraType, setCameraType] = useState("user");
  const [availableCameras, setAvailableCameras] = useState([]);
  const [error, setError] = useState(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const updateAvailableCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");
      setAvailableCameras(cameras);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices.addEventListener(
      "devicechange",
      updateAvailableCameras,
    );
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        updateAvailableCameras,
      );
    };
  }, [updateAvailableCameras]);

  const startCamera = useCallback(
    async (type = "user") => {
      try {
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
          await videoRef.current.play();
          setIsCameraOn(true);
          setCameraType(type);
          await updateAvailableCameras();
        }
      } catch (error) {
        setError(error);
        console.error("Error accessing camera:", error);

        if (error.name === "OverconstrainedError") {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
            });
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              await videoRef.current.play();
              setIsCameraOn(true);
              setCameraType("user");
              await updateAvailableCameras();
            }
          } catch (fallbackError) {
            setError(fallbackError);
            console.error("Fallback camera access failed:", fallbackError);
          }
        }
      }
    },
    [updateAvailableCameras],
  );

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
    const newType = cameraType === "user" ? "environment" : "user";
    startCamera(newType);
  }, [isCameraOn, cameraType, startCamera]);

  const capturePhoto = useCallback((texts = [], options = {}) => {
    const video = videoRef.current;
    if (!video || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (texts.length > 0) {
      const {
        font = "16px Arial",
        color = "white",
        outlineColor = "black",
        outlineWidth = 2,
        backgroundColor = "rgba(0, 0, 0, 0.7)",
        padding = 10,
        lineHeight = 20,
        textAlign = "center",
        textBaseline = "middle",
      } = options;

      ctx.font = font;
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;

      const textBlockHeight = texts.length * lineHeight + padding * 2;
      const textYStart = canvas.height - textBlockHeight - padding;

      const textMetrics = texts.map((text) => ctx.measureText(text));
      const maxWidth = Math.max(...textMetrics.map((m) => m.width));
      const bgWidth = maxWidth + padding * 2;
      const bgX =
        {
          left: padding,
          center: (canvas.width - bgWidth) / 2,
          right: canvas.width - bgWidth - padding,
        }[textAlign] || padding;

      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(bgX, textYStart, bgWidth, textBlockHeight);
      }

      texts.forEach((text, index) => {
        const yPosition =
          textYStart + padding + index * lineHeight + lineHeight / 2;
        const xPosition =
          {
            left: padding,
            center: canvas.width / 2,
            right: canvas.width - padding,
          }[textAlign] || padding;

        if (outlineWidth > 0) {
          ctx.strokeStyle = outlineColor;
          ctx.lineWidth = outlineWidth;
          ctx.strokeText(text, xPosition, yPosition);
        }

        ctx.fillStyle = color;
        ctx.fillText(text, xPosition, yPosition);
      });
    }

    setCapturedPhoto(canvas.toDataURL("image/png"));
  }, []);

  return {
    videoRef,
    canvasRef,
    isCameraOn,
    setIsCameraOn,
    capturedPhoto,
    setCapturedPhoto,
    cameraType,
    setCameraType,
    availableCameras,
    setAvailableCameras,
    error,
    setError,
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
  };
};

export default useCamera;
