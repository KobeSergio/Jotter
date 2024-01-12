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
    <main className="flex flex-col w-full h-full px-6 py-8 gap-6">
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

      {(files as any).length != 0 && (
        <div className="w-full flex justify-end mt-4">
          <div className="w-1/4 p-4 bg-green-800 text-white flex items-center justify-center rounded-sm">
            Proceed
          </div>
        </div>
      )}
    </main>
  );
}
