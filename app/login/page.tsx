"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/Spinner";
import Image from "next/image";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen z-50 bg-white px-6 py-12 lg:py-24">
      <Image
        src="./Jotter-removebg-preview.svg"
        width={150}
        height={150}
        alt={"logo"}
      />
      <h2 className="text-xl text-[#171F27] font-bold text-center -mt-10 select-none">
        Jotter
      </h2>
      <button
        type="button"
        onClick={async () => {
          setIsLoading(true);
          await signIn("google").then(() => {
            router.push("/");
            setIsLoading(false);
          });
        }}
        className="lg:w-1/4 bg-[#171F27]/90 hover:bg-[#171F27] font-medium text-center text-base text-white py-3 px-5 rounded-lg mt-6 flex items-center justify-center select-none"
      >
        {isLoading ? <Spinner /> : "Sign in with Google"}
      </button>
    </div>
  );
}
