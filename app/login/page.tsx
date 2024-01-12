"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Login() {
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen  z-50 bg-white px-6 py-12 lg:py-24">
      <h2 className="font-monts text-xl text-green-700 font-bold text-center mt-6">
        JOTTER
      </h2>
      <button
        type="button"
        onClick={() => signIn("google")}
        className=" w-1/4 bg-blue-900 hover:bg-[#365592] font-monts font-semibold text-center text-sm  text-white py-3 px-5 rounded-lg mt-6 flex items-center justify-center"
      >
        Sign in with google
      </button>
    </div>
  );
}
