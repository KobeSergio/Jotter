import { useEffect, useState } from "react";
import { PageSpinner } from "@/components/Spinner";
import Dropzone from "./Dropzone";
import Recorder from "./RecorderField";
import { FaMicrophone, FaCloudUploadAlt } from "react-icons/fa";
import { ref } from "firebase/storage";
import { audioProcessor } from "@/lib/functions/audio-processor";
import { Session } from "next-auth";
import FirebaseClass from "@/lib/classes/FirebaseClass";
import { useRecording } from "@/contexts/RecordingContext";
import { Recording } from "@/types/Recording";

export default function NewRecording({
  session,
  firebase,
}: {
  session: Session;
  firebase: FirebaseClass;
}) {
  const { setRecordings, setSelectedRecording } = useRecording();

  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadType, setUploadType] = useState<"upload" | "record">("upload");
  const uploadFiles = async () => {
    const file = files[0];
    if (!file) return;
    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      if (!session.user?.email) return;

      //===========================Step 1: Send the audio FILE to the transcription API===========================
      let formData = new FormData();
      formData.append("audioFile", file);

      const response = await fetch("/api/openai/", {
        method: "POST",
        body: formData,
      }).catch((err: any) => {
        console.log(err);
      });

      const { transcription } = await response?.json(); // <== output
      console.log(transcription);

      //===========================Step 2: Send the transcription to chatgpt===========================
      formData = new FormData();
      formData.append("transcript", transcription);

      const chatResponse = await fetch("/api/gpt/", {
        method: "POST",
        body: formData,
      }).catch((err: any) => {
        console.log(err);
      });

      const { summary } = await chatResponse?.json(); // <== output
      console.log(summary);

      //===========================Step 3: Upload the recording to firebase===========================
      const recordings: Recording[] = await firebase.uploadRecording(
        session.user?.email,
        file,
        transcription,
        summary
      );

      console.log(recordings);

      //Try catched because it will throw an error if the user has no recordings
      try {
        if (recordings?.length != 0) {
          setRecordings(recordings);
          setSelectedRecording(recordings?.length - 1);
        }
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    };
  };

  useEffect(() => {
    console.log(files);
  }, [files]);

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <PageSpinner />
      </div>
    );

  return (
    <div className="flex flex-col w-full h-screen px-6 py-8 gap-4">
      <h2 className="text-[#242424] text-lg font-bold select-none">
        Upload or record an audio
      </h2>
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        <div
          className={`w-full sm:w-1/2 h-full bg-white p-3 sm:p-8 cursor-pointer select-none flex flex-col items-center justify-center rounded-lg ${
            uploadType === "upload"
              ? "border-2 border-[#171F27] text-[#171F27]"
              : "text-[#C4C4C4] hover:text-[#555555]"
          }`}
          onClick={() => {
            setUploadType("upload");
            setFiles([]);
          }}
        >
          <FaCloudUploadAlt size={30} />
          <p className="font-semibold text-base sm:text-lg text-center">
            Upload an audio
          </p>
        </div>
        <div
          className={`w-full sm:w-1/2 h-full bg-white p-3 sm:p-8 cursor-pointer select-none flex flex-col items-center justify-center rounded-lg ${
            uploadType === "record"
              ? "border-2 border-[#171F27] text-[#171F27]"
              : "text-[#C4C4C4] hover:text-[#555555]"
          }`}
          onClick={() => {
            setUploadType("record");
            setFiles([]);
          }}
        >
          <FaMicrophone size={30} />
          <p className="font-semibold text-base sm:text-lg text-center">
            Record an audio
          </p>
        </div>
      </div>
      {uploadType === "upload" ? (
        <Dropzone setFiles={setFiles} files={files} />
      ) : (
        <Recorder setFiles={setFiles} files={files} />
      )}
      <div className="w-full h-24 flex justify-end">
        {(files as any).length != 0 && (
          <div
            onClick={() => {
              uploadFiles();
            }}
            className="w-fit h-fit px-6 py-3 flex items-center justify-center bg-[#171F27] hover:bg-[#004BAA] text-base font-medium text-white rounded-lg cursor-pointer select-none"
          >
            Proceed
          </div>
        )}
      </div>
    </div>
  );
}
