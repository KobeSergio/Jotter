import React, { useState, useRef } from "react";

export default function Recorder({
  setFiles,
  files,
}: {
  setFiles: React.Dispatch<React.SetStateAction<any>>;
  files: any;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const audioRef = useRef(null);

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.ondataavailable = (e) => {
          const newFile = [e.data];
          setFiles(newFile);
        };

        setMediaRecorder(mediaRecorder);
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    } else {
      console.error("getUserMedia not supported on your browser!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center justify-center">
        <button
          type="button"
          className="w-12 h-12 border-4 rounded-full flex items-center justify-center focus:outline-none transition-all duration-300
             border-gray-200 bg-white"
          onClick={isRecording ? stopRecording : startRecording}
        >
          <div
            className={`w-9 h-9 transition-all duration-300 ease-in-out bg-red-600 ${
              isRecording
                ? "rounded-md transform scale-50"
                : "rounded-full"
            }`}
          ></div>
        </button>

        {/* <button
          className={`rounded-full h-52 w-52 bg-gray-200/20 ${
            isRecording ? "bg-red-500" : ""
          }`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording
            ? "Stop Recording"
            : files.length == 0
            ? "Start Recording"
            : "Start new Recording"}
        </button> */}
        {files.length > 0 && (
          <audio ref={audioRef} controls>
            <source src={URL.createObjectURL(files[0])} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
}
