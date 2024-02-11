"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";
import { PiWaveformBold } from "react-icons/pi";
import { motion } from "framer-motion";
import { useRecording } from "@/contexts/RecordingContext";
import { Recording } from "@/types/Recording";
import SignOutModal from "./SignOutModal";

export default function NavMobile({ session }: { session: any }) {
  const { selectedRecording, setSelectedRecording, recordings } =
    useRecording();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <SignOutModal
        isOpen={showModal}
        setter={() => setShowModal(false)}
        onSubmit={() => {
          signOut();
          setShowModal(false);
        }}
      />
      <div
        className={`${
          isOpen ? "fixed inset-0" : "w-16"
        } z-10 py-8 flex flex-col lg:hidden bg-darkGreen h-full transition-all duration-500 ease-in-out`}
      >
        {isOpen ? (
          <>
            <Hamburger
              toggle={() => setIsOpen((prev) => !prev)}
              isOpen={isOpen}
            />
            <div className="px-6 py-4 space-y-2">
              <h2 className="text-white text-lg font-bold text-center select-none">
                All Recordings
              </h2>
              <div
                onClick={() => {
                  setSelectedRecording(null);
                  setIsOpen(false);
                }}
                className="w-full px-12 py-4 flex items-center justify-center bg-mainGreen hover:bg-opacity-95 text-base font-bold text-center text-darkGreen rounded-lg cursor-pointer select-none"
              >
                + Add a new recording
              </div>
            </div>
            <div className="h-full flex flex-col overflow-y-auto">
              {recordings?.length !== 0 && recordings ? (
                recordings?.map((recording: Recording, index: number) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-1.5 px-6 py-5 select-none ${
                      selectedRecording == index
                        ? "bg-mainGreen/10 text-white"
                        : "text-white hover:bg-mainGreen/10 cursor-pointer"
                    }`}
                    onClick={() => {
                      setSelectedRecording(index);
                      setIsOpen(false);
                    }}
                  >
                    <p className="text-base font-medium">{recording.name}</p>
                    <div className="flex justify-between">
                      <p className="text-xs font-medium">{recording.date}</p>
                      <p className="text-xs font-medium"></p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col justify-center items-center gap-2 p-4">
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
              onClick={() => {
                setShowModal(true);
                setIsOpen(false);
              }}
            >
              <MdLogout size={16} />
              Logout
            </div>
          </>
        ) : (
          <>
            <Hamburger
              toggle={() => setIsOpen((prev) => !prev)}
              isOpen={isOpen}
            />
          </>
        )}
      </div>
    </>
  );
}

const Path = (props: any) => (
  <motion.path
    fill="white"
    strokeWidth="3"
    stroke="white"
    strokeLinecap="round"
    {...props}
  />
);

function Hamburger({ toggle, isOpen }: any) {
  return (
    <button
      type="button"
      onClick={toggle}
      className="z-40 cursor-pointer bg-transparent w-full px-6"
    >
      <svg width="23" height="23" viewBox="0 0 23 23">
        <Path
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
          animate={isOpen ? "open" : "closed"}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
          animate={isOpen ? "open" : "closed"}
        />
        <Path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
          animate={isOpen ? "open" : "closed"}
        />
      </svg>
    </button>
  );
}
