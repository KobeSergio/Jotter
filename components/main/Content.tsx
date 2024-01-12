"use client";

import { useEffect, useState } from "react";

import React from "react";
import { PageSpinner } from "@/components/Spinner";
import Dropzone from "./Dropzone";
import Recorder from "./Recorder";

export default function Content() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadType, setUploadType] = useState<"upload" | "record">("upload");

  console.log(files);

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <PageSpinner />
      </div>
    );

  return (
    <main className="flex h-screen items-start justify-between gap-4 p-8">
      <div className="w-1/4 h-full bg-gray-300/20 justify-center p-8 flex flex-col gap-4 rounded-md">
        <h2 className="font-monts text-xl font-bold text-center">
          All Recordings
        </h2>
        <div className="w-full h-16 flex items-center justify-center bg-green-800 text-white rounded-sm">
          Add a new recording
        </div>
        <div className="h-full bg-white flex flex-col p-4 gap-3 rounded-sm">
          No recordings yet. Add a new recording to get started.
        </div>
      </div>
      <div className="flex-col w-3/4 h-full">
        <div className="w-full h-[90%] flex flex-col justify-center items-center gap-4">
          <div className="w-full bg-gray-300/20 h-1/6 flex p-6 gap-3">
            <div
              className="w-1/2 h-full bg-white flex items-center justify-center hover:bg-gray-400/20"
              onClick={() => {
                setUploadType("upload");
                setFiles([]);
              }}
            >
              Upload an audio
            </div>
            <div
              className="w-1/2 h-full bg-white flex items-center justify-center hover:bg-gray-400/20"
              onClick={() => {
                setUploadType("record");
                setFiles([]);
              }}
            >
              Record an audio
            </div>
          </div>
          {uploadType === "upload" ? (
            <Dropzone setFiles={setFiles} files={files} />
          ) : (
            <Recorder setFiles={setFiles} files={files} />
          )}
        </div>
        {(files as any).length != 0 && (
          <div className="w-full flex justify-end mt-4">
            <div className="w-1/4 p-4 bg-green-800 text-white flex items-center justify-center rounded-sm">
              Proceed
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
