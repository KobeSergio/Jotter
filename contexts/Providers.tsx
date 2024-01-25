"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { RecordingProvider } from "./RecordingContext";
import { FirebaseProvider } from "./FirebaseContext";

interface Props {
  children: ReactNode;
}

const Providers = (props: Props) => {
  return (
    <FirebaseProvider>
      <SessionProvider>
        <RecordingProvider>{props.children}</RecordingProvider>
      </SessionProvider>
    </FirebaseProvider>
  );
};

export default Providers;
