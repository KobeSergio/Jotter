"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { MdLogout } from "react-icons/md";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { PiWaveformBold } from "react-icons/pi";

export default function NavDesktop({ session }: { session: any }) {
  const [isCollapsed, setIsCollaped] = useState(false);

  return (
    <div
      className={`relative ${
        isCollapsed ? "w-16" : "w-1/3"
      } h-screen bg-[#171F27] flex flex-col gap-4 py-8 transition-all duration-500 ease-in-out`}
    >
      {/* Toggle button */}
      <div
        className="absolute flex text-center top-12 -right-3 p-1 text-white rounded-full bg-[#171F27] cursor-pointer"
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
          <Link href={"/"} className="flex justify-center items-center gap-2">
            <Image
              src="../next.svg"
              width={50}
              height={50}
              alt={"logo"}
              color="white"
            />
            <h2 className="text-white text-xl font-semibold cursor-pointer select-none">
              Jotter
            </h2>
          </Link>
          <div className="px-6 py-4 space-y-2">
            <h2 className="text-white text-lg font-bold text-center select-none">
              All Recordings
            </h2>
            <div className="w-full px-6 py-3 flex items-center justify-center bg-[#005FD7] hover:bg-[#004BAA] text-base font-medium text-white rounded-lg cursor-pointer select-none">
              + Add a new recording
            </div>
          </div>
          <div className="h-[420px] flex flex-col overflow-y-auto">
            <div className="flex flex-col items-center gap-2 p-4">
              <PiWaveformBold size={42} color="white" />
              <p className="text-white text-base font-medium text-center select-none">
                No recordings yet. <br></br>{" "}
                <span className="text-sm text-[#C4C4C4]">
                  Add a new recording to get started.
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-1.5 px-6 py-5 hover:bg-[#28333E] cursor-pointer select-none">
              <p className="text-white text-base font-medium">Recording 1</p>
              <div className="flex justify-between">
                <p className="text-white text-xs font-medium">Jan 12, 2024</p>
                <p className="text-white text-xs font-medium">00:51</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 px-6 py-5 hover:bg-[#28333E] cursor-pointer select-none">
              <p className="text-white text-base font-medium">Recording 1</p>
              <div className="flex justify-between">
                <p className="text-white text-xs font-medium">Jan 12, 2024</p>
                <p className="text-white text-xs font-medium">00:51</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 px-6 py-5 hover:bg-[#28333E] cursor-pointer select-none">
              <p className="text-white text-base font-medium">Recording 1</p>
              <div className="flex justify-between">
                <p className="text-white text-xs font-medium">Jan 12, 2024</p>
                <p className="text-white text-xs font-medium">00:51</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 px-6 py-5 hover:bg-[#28333E] cursor-pointer select-none">
              <p className="text-white text-base font-medium">Recording 1</p>
              <div className="flex justify-between">
                <p className="text-white text-xs font-medium">Jan 12, 2024</p>
                <p className="text-white text-xs font-medium">00:51</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 px-6 py-5 hover:bg-[#28333E] cursor-pointer select-none">
              <p className="text-white text-base font-medium">Recording 1</p>
              <div className="flex justify-between">
                <p className="text-white text-xs font-medium">Jan 12, 2024</p>
                <p className="text-white text-xs font-medium">00:51</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 px-6 py-5 hover:bg-[#28333E] cursor-pointer select-none">
              <p className="text-white text-base font-medium">Recording 1</p>
              <div className="flex justify-between">
                <p className="text-white text-xs font-medium">Jan 12, 2024</p>
                <p className="text-white text-xs font-medium">00:51</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 px-6 py-5 hover:bg-[#28333E] cursor-pointer select-none">
              <p className="text-white text-base font-medium">Recording 1</p>
              <div className="flex justify-between">
                <p className="text-white text-xs font-medium">Jan 12, 2024</p>
                <p className="text-white text-xs font-medium">00:51</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 px-6 py-5 hover:bg-[#28333E] cursor-pointer select-none">
              <p className="text-white text-base font-medium">Recording 1</p>
              <div className="flex justify-between">
                <p className="text-white text-xs font-medium">Jan 12, 2024</p>
                <p className="text-white text-xs font-medium">00:51</p>
              </div>
            </div>
          </div>
          <div
            className="w-fit flex items-center gap-2 text-red-500 hover:text-red-600 text-lg font-semibold cursor-pointer px-6 select-none"
            onClick={() => signOut()}
          >
            <MdLogout size={16} />
            Logout
          </div>
        </>
      ) : (
        <Link href={"/"} className="flex justify-center items-center gap-2">
          <Image
            src="../next.svg"
            width={50}
            height={50}
            alt={"logo"}
            color="white"
          />
        </Link>
      )}
    </div>
  );
}
