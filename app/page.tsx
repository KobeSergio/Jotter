"use client";

import Content from "@/components/main/Content";
import NavDesktop from "@/components/NavDesktop";
import NavMobile from "@/components/NavMobile";
import { useEffect, useState } from "react";
import { getServer } from "@/lib/functions/getServer";
import { PageSpinner } from "@/components/Spinner";
import { useRecording } from "@/contexts/RecordingContext";
import { useFirebase } from "@/contexts/FirebaseContext";
import { Session } from "next-auth";
import { Recording } from "@/types/Recording";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const { firebase } = useFirebase();

  const { setRecordings, recordings } = useRecording();

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      getServer().then((session: Session | null) => {
        if (!session) {
          router.push("/login");
          return;
        }

        setSession(session);
        // Load the user's recordings
        if (session.user?.email && recordings?.length === 0) {
          firebase
            .getRecording(session.user?.email)
            .then((_recordings: Recording[]) => {
              setRecordings(_recordings);
            });
        }
      });
    }
  }, [router]);

  if (!session)
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <PageSpinner />
      </div>
    );

  return (
    <div className="flex h-screen">
      <NavDesktop session={session} />
      <NavMobile session={session} />
      <Content session={session} />
    </div>
  );
}
