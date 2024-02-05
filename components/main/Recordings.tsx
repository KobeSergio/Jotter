import { useRecording } from "@/contexts/RecordingContext";
import FirebaseClass from "@/lib/classes/FirebaseClass";
import { Recording } from "@/types/Recording";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import AudioPlayer from "./AudioPlayer";

export default function Recordings({
  session,
  firebase,
}: {
  session: Session;
  firebase: FirebaseClass;
}) {
  const { recordings, selectedRecording } = useRecording();
  const { name, transcription, chatResponse, url, date } =
    recordings[selectedRecording as number];

  const [showFullTranscript, setShowFullTranscript] = useState(false);

  // Function to toggle the full transcript view
  const toggleTranscript = () => {
    setShowFullTranscript(!showFullTranscript);
  };

  // Function to truncate transcription
  const truncateTranscript = (text: string, length = 300) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  if (selectedRecording !== null) {
    return (
      <div className="w-full h-screen overflow-scroll flex flex-col items-start px-6 py-8">
        <div className="flex flex-col gap-2 w-full border-b border-b-gray pb-4">
          <div className="font-bold text-2xl">{name}</div>
          <div className="font-medium text-sm">{date}</div>
          <AudioPlayer url={url} />
        </div>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full mt-4">
          {formatPrompt(chatResponse)}
          <div className="w-full lg:w-1/2 flex items-start flex-col gap-2">
            <div className="font-bold uppercase text-sm text-darkGreen select-none">Transcript</div>
            <div className="overflow-scroll text-darkGreen text-base font-semibold">
              {showFullTranscript
                ? transcription
                : truncateTranscript(transcription)}
              <button
                onClick={toggleTranscript}
                className="text-darkGreen hover:underline underline-offset-2 text-base font-semibold ml-1 select-none"
              >
                {showFullTranscript ? " See Less" : " See More"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
}

function formatPrompt(summary: string) {
  const notesDelimiter = "Notes:";
  const deliverablesDelimiter = "Deliverables:";

  // Regular expression to split on dash or asterisk followed by space
  const splitRegex = /(-|\*)\s+/;

  const [notesSection, deliverablesSection] = summary.split(
    deliverablesDelimiter
  );

  const notes = notesSection
    .replace(notesDelimiter, "")
    .trim()
    .split(splitRegex)
    .filter((note) => note.trim() !== "" && note !== "-" && note !== "*");
  const deliverables = deliverablesSection
    .trim()
    .split(splitRegex)
    .filter(
      (deliverable) =>
        deliverable.trim() !== "" && deliverable !== "-" && deliverable !== "*"
    );

  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-4">
      <div className="space-y-2">
        <h3 className="font-bold uppercase text-sm text-darkGreen select-none">Notes</h3>
        <div className="p-4 rounded-lg bg-gray">
          <ul className="list-disc pl-5 text-darkGreen font-semibold text-base">
            {notes.map((note, index) => (
              <li key={index}>{note.trim()}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold uppercase text-sm text-darkGreen select-none">
          Deliverables
        </h3>
        <div className="p-4 rounded-lg bg-gray">
          <ul className="list-disc pl-5 text-darkGreen font-semibold text-base">
            {deliverables.map((deliverable, index) => (
              <li key={index}>{deliverable.trim()}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
