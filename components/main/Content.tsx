"use client";

import { useFirebase } from "@/contexts/FirebaseContext";
import { Session } from "next-auth";

import { useRecording } from "@/contexts/RecordingContext";
import NewRecording from "./NewRecording";
import Recordings from "./Recordings";

export default function Content({ session }: { session: Session }) {
  const { firebase } = useFirebase();
  const { selectedRecording } = useRecording();

  if (selectedRecording == null)
    return <NewRecording session={session} firebase={firebase} />;

  return <Recordings session={session} firebase={firebase} />;
}
