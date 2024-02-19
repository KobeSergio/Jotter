import { useRecording } from "@/contexts/RecordingContext";
import FirebaseClass from "@/lib/classes/FirebaseClass";
import { Recording } from "@/types/Recording";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import AudioPlayer from "./AudioPlayer";
import DeleteRecordingModal from "../modals/DeleteRecording";
import { useFirebase } from "@/contexts/FirebaseContext";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";

export default function Recordings({ session }: { session: Session }) {
  const { selectedRecording, setSelectedRecording, recordings, setRecordings } =
    useRecording();
  const { name, transcription, chatResponse, url, date } =
    recordings[selectedRecording as number];
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteRecordingModal, setShowDeleteRecordingModal] =
    useState(false);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { firebase } = useFirebase();
  const [newName, setNewName] = useState("");
  const [editingRecordingIndex, setEditingRecordingIndex] = useState<
    number | null
  >(null);

  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const handleDeleteRecording = async () => {
    setIsLoading(true);
    if (selectedRecording !== null) {
      const updatedRecordings = await firebase.deleteRecording(
        session.user?.email as string,
        recordings[Number(selectedRecording)].name
      );
      if (updatedRecordings) {
        setSelectedRecording(null);
        setRecordings(updatedRecordings);
      }
    }
    setIsLoading(false);
    setShowDeleteRecordingModal(false);
  };

  const handleRename = useCallback(
    async (index: number) => {
      const newNameTrimmed = newName.trim();

      if (newNameTrimmed && newNameTrimmed !== recordings[index].name) {
        const success = await firebase.updateRecordingName(
          session.user?.email ?? "",
          recordings[index].name,
          newNameTrimmed
        );

        if (success) {
          const updatedRecordings = [...recordings];
          updatedRecordings[index] = {
            ...recordings[index],
            name: newNameTrimmed,
          };
          setRecordings(updatedRecordings);
          setEditingRecordingIndex(null);
          setNewName("");
        } else {
          console.error("Failed to rename the recording.");
          // Optionally handle the error, such as prompting the user
        }
      } else {
        setEditingRecordingIndex(null);
        setNewName("");
      }
    },
    [
      recordings,
      newName,
      firebase,
      session.user?.email,
      setRecordings,
      setEditingRecordingIndex,
      setNewName,
    ]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const isOutsideMenu =
        menuRef.current && !menuRef.current.contains(target);
      const isOutsideInput =
        inputRef.current && !inputRef.current.contains(target);

      // If the click is outside the menu, perform the menu-specific action
      if (isOutsideMenu) {
        console.log("Click was outside the menu.");
        setIsOpen(null);
      }

      // If the click is outside the input field, and we're in editing mode, perform the input-specific action
      if (editingRecordingIndex !== null && isOutsideInput) {
        console.log("Click was outside the input during editing.");
        handleRename(editingRecordingIndex);
        setEditingRecordingIndex(null);
        setNewName(""); // Reset newName or potentially save changes here
      }
    }

    // Register the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, inputRef, editingRecordingIndex, handleRename]);

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
      <>
        <DeleteRecordingModal
          isOpen={showDeleteRecordingModal}
          setter={() => setShowDeleteRecordingModal(false)}
          onSubmit={handleDeleteRecording}
          isLoading={isLoading}
        />
        <div className="w-full h-screen overflow-scroll flex flex-col items-start px-6 py-8">
          <div className="flex flex-col gap-2 w-full border-b border-b-gray pb-4">
            <div className="min-w-full flex justify-between items-center md:items-start gap-4">
              <p className="font-bold text-2xl max-sm:truncate">
                {editingRecordingIndex === selectedRecording ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={newName}
                    autoFocus
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={() => handleRename(selectedRecording as number)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRename(selectedRecording as number);
                      }
                    }}
                    className="w-full font-bold text-2xl outline-none underline"
                    spellCheck={false}
                  />
                ) : (
                  name
                )}
              </p>
              <div className="flex lg:hidden gap-2 items-center">
                <MdDriveFileRenameOutline
                  size={22}
                  onClick={() => {
                    setEditingRecordingIndex(
                      selectedRecording as number | null
                    );
                    setNewName(name); // Initialize input with current name
                  }}
                  className="cursor-pointer hover:scale-105"
                  title="Rename recording"
                />
                <FaTrashCan
                  size={17}
                  onClick={() => setShowDeleteRecordingModal(true)}
                  className="cursor-pointer hover:scale-105"
                  title="Delete recording"
                />
              </div>
            </div>
            <p className="font-medium text-sm">{date}</p>
            <AudioPlayer url={url} />
          </div>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full mt-4">
            {formatPrompt(chatResponse)}
            <div className="w-full lg:w-1/2 flex items-start flex-col gap-2">
              <div className="font-bold uppercase text-sm text-darkGreen select-none">
                Transcript
              </div>
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
      </>
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
        <h3 className="font-bold uppercase text-sm text-darkGreen select-none">
          Notes
        </h3>
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
