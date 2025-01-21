import { Pause, Play } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect, useRef, useState } from "react";

const VoicePlayer = ({ audioFile }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const sound = useRef(null);

  useEffect(() => {
    sound.current = new Audio(audioFile);

    sound.current.onloadedmetadata = () => {
      setDuration(sound.current.duration);
    };

    sound.current.ontimeupdate = () => {
      setCurrentTime(sound.current.currentTime);
    };

    return () => {
      if (sound.current) {
        sound.current.pause();
        sound.current = null;
      }
    };
  }, [audioFile]);

  const togglePlayback = () => {
    if (isPlaying) {
      sound.current.pause();
    } else {
      sound.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onSliderValueChange = (value) => {
    if (sound.current) {
      sound.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="w-full p-3">
      <div className="flex w-full items-center justify-center p-3">
        <Slider
          className="mb-3 w-11/12"
          min={0}
          max={duration}
          value={currentTime}
          onChange={onSliderValueChange}
        />
        <button onClick={togglePlayback}>
          {isPlaying ? (
            <Pause className="text-primary" size={24} />
          ) : (
            <Play className="text-primary" size={24} />
          )}
        </button>
      </div>

      <div className="flex justify-between">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default VoicePlayer;
