import React, { useEffect, useRef, useState } from "react";

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

  // ⏸
  return (
    <div className="w-full h-fit flex flex-col items-center justify-center mt-2">
      <div id="waveform" ref={waveformRef} className="w-full" />
      <div className="controls flex flex-wrap items-center justify-center mt-4 gap-4">
        <button
          onClick={handlePlayPause}
          className="w-12 bg-darkGreen hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded inline-flex items-center justify-center"
        >
          <span>{!playing ? "▶" : "II"}</span>
        </button>
        <div className="flex items-center">
          <input
            type="range"
            id="volume"
            name="volume"
            min="0.01"
            max="1"
            step=".025"
            onChange={onVolumeChange}
            defaultValue={volume}
            className="mr-2"
          />
          <label htmlFor="volume" className="text-sm">
            Volume
          </label>
        </div>
      </div>
    </div>
  );
}
