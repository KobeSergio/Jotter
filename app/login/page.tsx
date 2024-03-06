"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/Spinner";
import { FcGoogle } from "react-icons/fc";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import TextField from "@/components/TextField";
import { FaEyeSlash, FaEye } from "react-icons/fa";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="flex flex-col items-center justify-center w-full md:w-[500px] h-fit bg-white px-6 py-8 border border-buttonBorder rounded-lg gap-[30px]">
      <h2 className="font-bold text-2xl text-center text-darkGreen select-none cursor-pointer">
        Log in to continue
      </h2>
      <div className="min-w-full flex flex-col items-center justify-center gap-[30px]">
        <div className="w-full flex flex-col items-center justify-center gap-3">
          <SecondaryButton className="gap-2">
            <FcGoogle size={24} />
            Log in with Google
          </SecondaryButton>
          <p className="text-textField font-normal text-base select-none">or</p>
          <TextField type="text" placeholder="Mobile number or email address" />
          <div className="w-full relative">
            <TextField
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-4 cursor-pointer flex items-center"
            >
              {showPassword ? (
                <FaEyeSlash size={18} className="text-darkGreen" />
              ) : (
                <FaEye size={18} className="text-darkGreen" />
              )}
            </div>
          </div>
        </div>
      </div>
      <PrimaryButton
        className="gap-2"
        onClick={async () => {
          setIsLoading(true);
          await signIn("google").then(() => {
            setIsLoading(false);
          });
        }}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Spinner />
            Logging in
          </span>
        ) : (
          "Log in"
        )}
      </PrimaryButton>
      <p className="text-nav font-normal text-base select-none">
        Don&apos;t have an account?{" "}
        <span
          onClick={() => router.push("/signup")}
          className="text-darkGreen cursor-pointer font-semibold hover:underline"
        >
          Sign up
        </span>
      </p>
    </form>
  );
}
