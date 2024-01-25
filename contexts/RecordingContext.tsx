import { Recording } from "@/types/Recording";
import { createContext, useContext, useState } from "react";

export const RecordingContext = createContext<
  | {
      recordings: Recording[];
      setRecordings: React.Dispatch<React.SetStateAction<Recording[]>>;
      selectedRecording: Number | null;
      setSelectedRecording: React.Dispatch<React.SetStateAction<Number | null>>;
    }
  | undefined
>(undefined);

export const useRecording = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error("useRecording must be used within an RecordingProvider");
  }
  return context;
};

type RecordingProviderProps = {
  children: React.ReactNode;
};

export const RecordingProvider: React.FC<RecordingProviderProps> = ({
  children,
}) => {
  //Declare contexts here (Recordings and prb from local storage)
  const [selectedRecording, setSelectedRecording] = useState<Number | null>(
    null
  );
  const [recordings, setRecordings] = useState<Recording[]>([]);

  return (
    <RecordingContext.Provider
      value={{
        selectedRecording,
        setSelectedRecording,
        recordings,
        setRecordings,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
};
