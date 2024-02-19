"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { MdLogout } from "react-icons/md";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { PiWaveformBold } from "react-icons/pi";
import { FaEllipsis } from "react-icons/fa6";
import { FiCheck } from "react-icons/fi";
import { Recording } from "@/types/Recording";
import { useRecording } from "@/contexts/RecordingContext";
import SignOutModal from "./modals/SignOut";
import DeleteRecordingModal from "./modals/DeleteRecording";
import { Session } from "next-auth";
import { useFirebase } from "@/contexts/FirebaseContext";

export default function NavDesktop({ session }: { session: Session }) {
  const { selectedRecording, setSelectedRecording, recordings, setRecordings } =
    useRecording();

  const [isCollapsed, setIsCollaped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteRecordingModal, setShowDeleteRecordingModal] =
    useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [editingRecordingIndex, setEditingRecordingIndex] = useState<
    number | null
  >(null);
  const [newName, setNewName] = useState<string>("");
  const { firebase } = useFirebase();

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

  const handleRenameClick = (index: number) => {
    setEditingRecordingIndex(index);
    setNewName(recordings[index].name);
    setIsOpen(null);
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

  return (
    <>
      <DeleteRecordingModal
        isOpen={showDeleteRecordingModal}
        setter={() => setShowDeleteRecordingModal(false)}
        onSubmit={handleDeleteRecording}
        isLoading={isLoading}
      />
      <SignOutModal
        isOpen={showSignOutModal}
        setter={() => setShowSignOutModal(false)}
        onSubmit={() => {
          signOut();
          setShowSignOutModal(false);
        }}
      />
      <div
        className={`hidden lg:flex relative ${
          isCollapsed ? "w-16" : "w-1/3"
        } h-screen bg-darkGreen flex-col gap-4 py-8 transition-all duration-500 ease-in-out`}
      >
        {/* Toggle button */}
        <div
          className="absolute flex text-center top-12 -right-3 p-1 text-white rounded-full bg-darkGreen cursor-pointer"
          onClick={() => {
            setIsCollaped(!isCollapsed);
          }}
        >
          {isCollapsed ? (
            <IoChevronForward size={18} />
          ) : (
            <IoChevronBack size={18} />
          )}
        </div>
        {!isCollapsed ? (
          <>
            <Link href={"/"} className="flex justify-center items-center">
              <Image
                src="./Jotter-removebg-preview.svg"
                width={100}
                height={100}
                alt={"logo"}
              />
              <h2 className="text-white text-xl font-bold cursor-pointer select-none -ml-4">
                Jotter
              </h2>
            </Link>
            <div className="px-6 py-4 space-y-2">
              <h2 className="text-white text-lg font-bold text-center select-none">
                All Recordings
              </h2>
              <div
                onClick={() => {
                  setSelectedRecording(null);
                }}
                className="w-full px-12 py-4 flex items-center justify-center bg-mainGreen hover:bg-opacity-95 text-base font-bold text-center text-darkGreen rounded-lg cursor-pointer select-none"
              >
                + Add a new recording
              </div>
            </div>
            <div className="w-full h-full flex flex-col overflow-y-auto">
              {recordings?.length !== 0 && recordings ? (
                recordings?.map((recording: Recording, index: number) => (
                  <div
                    key={index}
                    className={`relative w-full flex justify-between px-6 py-5 select-none group ${
                      selectedRecording == index
                        ? "bg-mainGreen/10 text-white"
                        : "text-white hover:bg-mainGreen/10 cursor-pointer"
                    }`}
                    onClick={() => {
                      setSelectedRecording(index);
                    }}
                  >
                    <div className="flex flex-col gap-1.5">
                      {editingRecordingIndex === index ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleRename(index);
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              setEditingRecordingIndex(null);
                              setNewName("");
                            }
                          }}
                          autoFocus
                          spellCheck={false}
                          className="w-full bg-transparent underline outline-none"
                        />
                      ) : (
                        <p className="text-base font-semibold">
                          {recording.name}
                        </p>
                      )}

                      <div className="flex justify-between">
                        <p className="text-xs font-medium">{recording.date}</p>
                        <p className="text-xs font-medium"></p>
                      </div>
                    </div>
                    <FaEllipsis
                      size={15}
                      className={`text-white cursor-pointer transition-opacity duration-200 ${
                        selectedRecording == index || false
                          ? "opacity-100"
                          : "opacity-0 hidden"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(isOpen === index ? null : index); // Toggle or set the index
                      }}
                    />
                    {isOpen === index && (
                      <div
                        ref={menuRef}
                        className="flex flex-col absolute z-10 top-10 right-5 bg-gray rounded-lg py-1.5"
                      >
                        {/* Options menu items */}
                        <p
                          className="text-darkGreen font-semibold text-sm cursor-pointer px-2 py-1 hover:bg-mainGreen"
                          onClick={() => handleRenameClick(index)}
                        >
                          Rename
                        </p>
                        <p
                          className="text-darkGreen font-semibold text-sm cursor-pointer px-2 py-1 hover:bg-mainGreen"
                          onClick={() => {
                            setShowDeleteRecordingModal(true);
                            setIsOpen(null);
                          }}
                        >
                          Delete
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex flex-col items-center gap-2 p-4 pt-6">
                  <PiWaveformBold size={42} color="white" />
                  <p className="text-white text-base font-medium text-center select-none">
                    No recordings yet. <br></br>{" "}
                    <span className="text-sm text-[#C4C4C4]">
                      Add a new recording to get started.
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div
              className="w-fit flex items-center gap-2 text-red-500 hover:text-red-600 text-lg font-semibold cursor-pointer px-6 select-none"
              onClick={() => setShowSignOutModal(true)}
            >
              <MdLogout size={16} />
              Sign Out
            </div>
          </>
        ) : (
          <p className="flex justify-center items-center gap-2 font-bold text-white">
            <Image
              src="./Jotter-removebg-preview.svg"
              width={145}
              height={145}
              alt={"logo"}
            />
          </p>
        )}
      </div>
    </>
  );
}
