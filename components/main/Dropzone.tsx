import { useEffect } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone({
  setFiles,
  files,
}: {
  setFiles: React.Dispatch<React.SetStateAction<any>>;
  files: any;
}) {
  const accepts = {
    "audio/mp3": [],
    "audio/*": [],
  };

  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({
      accept: accepts as any,
      maxFiles: 1,
    });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
    }
  }, [acceptedFiles]);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div
      {...getRootProps({
        className: "dropzone",
      })}
      className="w-full h-full lg:h-[430px] flex flex-col justify-center items-center gap-2 px-14 py-16 border-2 border-dashed border-[#C4C4C4] rounded-lg cursor-pointer"
    >
      <input {...getInputProps()} />
      <p className="select-none text-sm text-[#C4C4C4] text-semibold text-center">
        {isDragActive ? (
          "Drop the audio file here ..."
        ) : files == undefined || files.length == 0 ? (
          `Click to upload or drag and drop your audio file here.`
        ) : (
          <>
            {files && files.length > 0 && (
              <ul>
                {files.map((file: any, index: number) => (
                  <li key={file.name}>
                    {file.name}{" "}
                    <div
                      className="text-[#242424] text-sm font-medium cursor-pointer"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </p>
    </div>
  );
}
