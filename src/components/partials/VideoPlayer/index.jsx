import { COLORS } from "@/constants/colors";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useRef, useState } from "react";

const VideoPlayer = ({ source, containerStyle, playerStyle }) => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);

  const onPlayPausePress = () => {
    setPaused(!paused);
    if (paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const onSkipForward = () => {
    videoRef.current.currentTime = currentTime + 10;
  };

  const onSkipBackward = () => {
    videoRef.current.currentTime = currentTime - 10;
  };

  const onVideoProgress = (event) => {
    setCurrentTime(event.target.currentTime);
  };

  const onVideoLoad = (event) => {
    setDuration(event.target.duration);
  };

  const onMutePress = () => {
    setIsMuted(!isMuted);
    // Muting/unmuting logic
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const onVolumeChange = (value) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value / 100; // Volume must be between 0 and 1
    }
  };

  const getTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className={`relative ${containerStyle} bg-black`}>
      <video
        ref={videoRef}
        src={source}
        className={`${playerStyle} w-full bg-black`}
        onTimeUpdate={onVideoProgress}
        onLoadedMetadata={onVideoLoad}
        muted={isMuted}
        onClick={() => setPaused(!paused)}
        style={{ objectFit: "contain" }}
      />
      <div className="flex items-center justify-between px-6 py-2">
        <Slider
          className="w-4/5"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(value) => (videoRef.current.currentTime = value)}
        />
        <span className="text-white">{`${getTime(currentTime)} / ${getTime(duration)}`}</span>
      </div>
      <div className="flex items-center justify-center gap-4 py-2">
        <button onClick={onSkipBackward}>
          <SkipBack className="text-white" size={24} />
        </button>
        <button onClick={onPlayPausePress}>
          {paused ? (
            <Play className="text-white" size={24} />
          ) : (
            <Pause className="text-white" size={24} />
          )}
        </button>
        <button onClick={onSkipForward}>
          <SkipForward className="text-white" size={24} />
        </button>
        <button onClick={onMutePress}>
          {isMuted ? (
            <VolumeX className="text-white" size={24} />
          ) : (
            <Volume2 className="text-white" size={24} />
          )}
        </button>
      </div>
      <div className="flex items-center justify-center py-2">
        <Slider
          className="w-4/5"
          min={0}
          max={100}
          value={volume}
          onChange={onVolumeChange}
          trackStyle={{ backgroundColor: COLORS.primary }}
          handleStyle={{ backgroundColor: COLORS.primary }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
