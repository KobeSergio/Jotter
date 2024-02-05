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
      <h2 className="w-52 font-black text-3xl text-center text-darkGreen select-none cursor-pointer -mt-10">
        Jotter
      </h2>
      <button
        type="button"
        onClick={async () => {
          setIsLoading(true);
          await signIn("google").then(() => {
            setIsLoading(false);
          });
        }}
        className="lg:w-1/4 h-fit border-darkGreen bg-darkGreen hover:border-opacity-95 hover:bg-opacity-95 font-bold text-center text-base text-white px-4 md:px-12 py-4 rounded-lg mt-6 flex items-center justify-center select-none"
      >
        {isLoading ? <span className="flex items-center"><Spinner />Signing in with Google</span> : "Sign in with Google"}
      </button>
    </div>
  );
}
