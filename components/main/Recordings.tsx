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
      <div className="w-full h-screen overflow-scroll flex flex-col items-start justify-between p-4 gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-start flex-col gap-2 w-full">
            <div className="font-semibold text-lg">{name}</div>
            <div className="">{date}</div>
          </div>
          <div className="flex items-start flex-col gap-2 w-full">
            <div className="font-semibold text-lg">Summary:</div>
            <div className="">{formatPrompt(chatResponse)}</div>
          </div>
        </div>
        <div className="flex items-start flex-col gap-2 w-full">
          <div className="font-semibold text-lg">Transcript:</div>
          <div className="overflow-scroll">
            {showFullTranscript
              ? transcription
              : truncateTranscript(transcription)}
            <button
              onClick={toggleTranscript}
              className="text-[#2e3c4b]/80 hover:text-[#2e3c4b] ml-1"
            >
              {showFullTranscript ? " See Less" : " See More"}
            </button>
          </div>
        </div>
        <AudioPlayer url={url} />
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
    <div>
      <div>
        <h3 className="font-bold">Notes:</h3>
        <ul className="list-disc pl-5">
          {notes.map((note, index) => (
            <li key={index}>{note.trim()}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Deliverables:</h3>
        <ul className="list-disc pl-5">
          {deliverables.map((deliverable, index) => (
            <li key={index}>{deliverable.trim()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
