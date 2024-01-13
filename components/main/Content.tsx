"use client";

import { useEffect, useState } from "react";
import React from "react";
import { PageSpinner } from "@/components/Spinner";
import Dropzone from "./Dropzone";
import Recorder from "./Recorder";
import { FaMicrophone, FaCloudUploadAlt } from "react-icons/fa";

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
    <main className="flex flex-col w-full h-screen px-6 py-8 gap-4">
      <h2 className="text-[#242424] text-lg font-bold select-none">
        Upload or record an audio
      </h2>
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        <div
          className={`w-full sm:w-1/2 h-full bg-white p-3 sm:p-8 cursor-pointer select-none flex flex-col items-center justify-center rounded-lg ${
            uploadType === "upload"
              ? "border-2 border-[#005FD7] text-[#005FD7]"
              : "text-[#C4C4C4] hover:text-[#555555]"
          }`}
          onClick={() => {
            setUploadType("upload");
            setFiles([]);
          }}
        >
          <FaCloudUploadAlt size={30} />
          <p className="font-semibold text-base sm:text-lg text-center">Upload an audio</p>
        </div>
        <div
          className={`w-full sm:w-1/2 h-full bg-white p-3 sm:p-8 cursor-pointer select-none flex flex-col items-center justify-center rounded-lg ${
            uploadType === "record"
              ? "border-2 border-[#005FD7] text-[#005FD7]"
              : "text-[#C4C4C4] hover:text-[#555555]"
          }`}
          onClick={() => {
            setUploadType("record");
            setFiles([]);
          }}
        >
          <FaMicrophone size={30} />
          <p className="font-semibold text-base sm:text-lg text-center">Record an audio</p>
        </div>
      </div>
      {uploadType === "upload" ? (
        <Dropzone setFiles={setFiles} files={files} />
      ) : (
        <Recorder setFiles={setFiles} files={files} />
      )}
<div className="w-full h-24 flex justify-end">
      {(files as any).length != 0 && (
        
            <div className="w-fit h-fit px-6 py-3 flex items-center justify-center bg-[#005FD7] hover:bg-[#004BAA] text-base font-medium text-white rounded-lg cursor-pointer select-none">
            Proceed
          </div>
        
      )}
      </div>
    </main>
  );
}
