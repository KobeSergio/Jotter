import React, { useEffect, useRef, useState } from "react";
import {
  RiForward10Fill,
  RiReplay10Fill,
  RiPlayFill,
  RiPauseFill,
} from "react-icons/ri";
import { IoVolumeMedium } from "react-icons/io5";
import WaveSurfer from "wavesurfer.js";

const formWaveSurferOptions = (ref: any) => ({
  container: ref,
  waveColor: "#eee",
  progressColor: "#213D39",
  cursorColor: "#BCE955",
  barWidth: 5,
  barRadius: 5,
  responsive: true,
  height: 100,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
});

export default function Waveform({ url }: { url: any }) {
  const waveformRef = useRef<any>(null);
  const wavesurfer = useRef<any>(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  useEffect(() => {
    if (!waveformRef.current || !url) return;

    // Preload the audio file
    const audio = new Audio(url);
    audio.oncanplaythrough = () => {
      setIsAudioLoaded(true);
    };
    audio.onerror = () => {
      console.error("Error loading audio file.");
    };
  }, [url]);

  useEffect(() => {
    if (!isAudioLoaded || !waveformRef.current) return;

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(url);

    const handleReady = () => {
      wavesurfer.current.setVolume(volume);
      setVolume(volume);
    };

    wavesurfer.current.on("ready", handleReady);
    wavesurfer.current.on("error", (e: any) => console.error(e));

    return () => {
      wavesurfer.current.destroy();
    };
  }, [isAudioLoaded]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = (e: any) => {
    const newVolume = +e.target.value;
    setVolume(newVolume);
    wavesurfer.current.setVolume(newVolume || 1);
  };

  const handleFastForward = () => {
    const currentTime = wavesurfer.current.getCurrentTime();
    wavesurfer.current.seekTo(
      (currentTime + 10) / wavesurfer.current.getDuration()
    );
  };

  const handleRewind = () => {
    const currentTime = wavesurfer.current.getCurrentTime();
    wavesurfer.current.seekTo(
      (currentTime - 10) / wavesurfer.current.getDuration()
    );
  };

  return (
    <div className="w-full h-fit flex flex-col items-center justify-center mt-2">
      <div id="waveform" ref={waveformRef} className="w-full" />
      <div className="controls flex flex-col md:flex-row max-md:gap-2 max-lg max-lg:justify-center items-center justify-between mt-4 w-full">
        <div className="flex-grow flex justify-center gap-4 ml-3">
          <button onClick={handleRewind} className="hover:scale-105">
            <RiReplay10Fill size={27} />
          </button>
          <button onClick={handlePlayPause} className="hover:scale-105">
            {!playing ? <RiPlayFill size={30} /> : <RiPauseFill size={30} />}
          </button>
          <button onClick={handleFastForward} className="hover:scale-105">
            <RiForward10Fill size={27} />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <IoVolumeMedium size={24} />
          <input
            type="range"
            id="volume"
            name="volume"
            min="0.01"
            max="1"
            title="volume"
            step=".025"
            onChange={onVolumeChange}
            defaultValue={volume}
            className="accent-darkGreen"
          />
        </div>
      </div>
    </div>
  );
}
