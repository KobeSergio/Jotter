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
    <div className="mb-4 w-full h-full">
      <div
        {...getRootProps({
          className: "dropzone",
        })}
        className="w-full h-full flex flex-col justify-center items-center my-4 gap-2 px-14 py-16 border-2 border-dashed border-black/25 rounded-[10px] cursor-pointer"
      >
        <div className="py-4 border-t-black/20">
          <div className="flex flex-col items-center justify-center dropzone">
            <input {...getInputProps()} />
            <p className="disable-text-selection text-sm w-full h-full text-black text-center text-semibold font-monts">
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
                            className="text-blue-900"
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
        </div>
      </div>
    </div>
  );
}
