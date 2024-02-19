import { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";
import Dropzone from "./Dropzone";
import Recorder from "./RecorderField";
import { FaMicrophone, FaCloudUploadAlt } from "react-icons/fa";
import { Session } from "next-auth";
import FirebaseClass from "@/lib/classes/FirebaseClass";
import { useRecording } from "@/contexts/RecordingContext";
import { Recording } from "@/types/Recording";
import OpenAI from "openai";

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

  const [progressBar, setProgressBar] = useState(0);

  const uploadFiles = async () => {
    const file = files[0];
    if (!file) return;
    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      if (!session.user?.email) return;

      //===========================Step 1: Send the audio FILE to the transcription API===========================

      setProgressBar(1);

      // let formData = new FormData();
      // formData.append("audioFileURL", downloadURL);
      // formData.append("audioFileName", file.name);
      // formData.append("audioFileType", file.type);

      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
        dangerouslyAllowBrowser: true,
      });

      const transcription = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        response_format: "text",
      });

      console.log(transcription);

      //If the transcription is empty or not a string, then the transcription failed
      if (!transcription || typeof transcription !== "string") {
        setIsLoading(false);
        return;
      }

      setProgressBar(2);
      //===========================Step 2: Send the transcription to chatgpt===========================
      // formData = new FormData();
      // formData.append("transcript", transcription);

      // const chatResponse = await fetch("/api/gpt/", {
      //   method: "POST",
      //   body: formData,
      // }).catch((err: any) => {
      //   console.log(err);
      // });

      // const { summary } = await chatResponse?.json(); // <== output

      const assistantId = "asst_9nefdUGeht4o0tAIY4QXNkXR";

      //Create new thread with the message as the audio transcript
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: transcription as string,
          },
        ],
      });

      //Run the thread with the assistant predefined on the backend
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });

      //Wait for run to complete
      let runComplete = false;
      let seconds = 0;
      while (!runComplete) {
        const isStillRunning = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
        if (isStillRunning.status === "completed") {
          runComplete = true;
        }
        //Wait 1 second before checking again
        await new Promise((resolve) => setTimeout(resolve, 1000));
        seconds++;
      }

      //Get the data of the thread
      const data: any = await openai.beta.threads.messages.list(thread.id);

      const summary = data.data[0].content[0].text.value;

      console.log(summary);

      setProgressBar(3);
      //===========================Step 3: Upload the recording to firebase===========================

      //Upload the file to firebase
      const downloadURL = await firebase.uploadRecording(
        session.user?.email,
        file
      );

      const recordings: Recording[] = await firebase.updateRecording(
        session.user?.email,
        file.name,
        downloadURL,
        transcription,
        summary
      );
      setProgressBar(4);
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
      <div className="w-full h-screen flex justify-center items-center gap-1">
        <Spinner />
        <p className="text-base text-darkGreen font-semibold select-none">
          {progressBar == 1
            ? "Parsing audio..."
            : progressBar == 2
            ? "Transcribing audio..."
            : progressBar == 3
            ? "Summarizing transcription..."
            : progressBar == 4
            ? "Generating page..."
            : ""}
        </p>
      </div>
    );

  return (
    <div className="flex flex-col w-full h-screen px-6 py-8 gap-4">
      <h2 className="text-darkGreen text-lg font-bold select-none">
        Upload or record an audio
      </h2>
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        <div
          className={`w-full sm:w-1/2 h-full bg-white p-3 sm:p-8 cursor-pointer select-none flex flex-col items-center justify-center rounded-lg ${
            uploadType === "upload"
              ? "border-2 border-darkGreen text-darkGreen"
              : "text-[#C4C4C4] hover:text-[#555555]"
          }`}
          onClick={() => {
            setUploadType("upload");
            setFiles([]);
          }}
        >
          <FaCloudUploadAlt size={30} />
          <p className="font-bold text-base sm:text-lg text-center">
            Upload an audio
          </p>
        </div>
        <div
          className={`w-full sm:w-1/2 h-full bg-white p-3 sm:p-8 cursor-pointer select-none flex flex-col items-center justify-center rounded-lg ${
            uploadType === "record"
              ? "border-2 border-darkGreen text-darkGreen"
              : "text-[#C4C4C4] hover:text-[#555555]"
          }`}
          onClick={() => {
            setUploadType("record");
            setFiles([]);
          }}
        >
          <FaMicrophone size={30} />
          <p className="font-bold text-base sm:text-lg text-center">
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
            className="w-fit h-fit px-6 py-3 flex items-center justify-center bg-darkGreen hover:bg-opacity-95 text-base font-bold text-white rounded-lg cursor-pointer select-none"
          >
            Proceed
          </div>
        )}
      </div>
    </div>
  );
}
