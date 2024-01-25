import FirebaseClass from "@/lib/classes/FirebaseClass";
import { createContext, useContext, useState } from "react";

export const FirebaseContext = createContext<
  | {
      firebase: FirebaseClass;
      setFirebase: React.Dispatch<React.SetStateAction<FirebaseClass>>;
    }
  | undefined
>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within an FirebaseProvider");
  }
  return context;
};

type FirebaseProviderProps = {
  children: React.ReactNode;
};

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
}) => {
  const [firebase, setFirebase] = useState<FirebaseClass>(new FirebaseClass());

  return (
    <FirebaseContext.Provider value={{ firebase, setFirebase }}>
      {children}
    </FirebaseContext.Provider>
  );
};
