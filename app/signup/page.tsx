"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import TextField from "@/components/TextField";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import DropdownButton from "@/components/buttons/DropdownButton";
import Image from "next/image";

function AccountDetails({ onNext }: { onNext: () => void }) {
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
    <form className="flex flex-col items-center justify-center w-full md:w-[500px] h-fit bg-white px-6 py-8 border border-buttonBorder rounded-lg gap-6">
      <div className="w-full flex flex-col items-center justify-center gap-2">
        <h2 className="font-bold text-2xl text-center text-darkGreen select-none">
          Create account
        </h2>
        <p className="font-medium text-base select-none text-nav text-center ">
          Let&apos;s get started. Sign up with Google or enter your details.
        </p>
      </div>
      <div className="min-w-full flex flex-col items-center justify-center gap-[30px]">
        <div className="w-full flex flex-col items-center justify-center gap-3">
          <SecondaryButton>
            <FcGoogle size={24} />
            Sign up with Google
          </SecondaryButton>
          <p className="text-textField font-normal text-base select-none">or</p>
          <div className="w-full flex gap-3">
            <TextField
              type="text"
              placeholder="First name"
              className="w-full"
            />
            <TextField type="text" placeholder="Last name" className="w-full" />
          </div>
          <TextField type="text" placeholder="Mobile number or email address" />
          <div className="w-full relative">
            <TextField
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full"
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
      <PrimaryButton onClick={onNext}>Next</PrimaryButton>
      <p className="text-nav font-normal text-base select-none">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/login")}
          className="text-darkGreen cursor-pointer font-semibold hover:underline"
        >
          Log in
        </span>
      </p>
    </form>
  );
}

function PhoneNumber({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);
  useEffect(() => {
    // Fetch the list of countries from an API (e.g., REST Countries API)
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((country: any) => country.name.common);
        // Sort the country names alphabetically
        countryNames.sort();
        setCountries(countryNames);
      })
      .catch((error) => console.error("Error fetching countries: ", error));
  }, []);

  return (
    <form className="flex flex-col items-center justify-center w-full md:w-[500px] h-fit bg-white px-6 py-8 border border-buttonBorder rounded-lg gap-6">
      <div className="w-full flex flex-col items-center justify-center gap-2">
        <h2 className="font-bold text-2xl text-center text-darkGreen select-none">
          Enter your mobile number
        </h2>
        <p className="font-medium text-base select-none text-nav text-center">
          Please confirm your country code and enter your phone number.
        </p>
      </div>
      <div className="min-w-full flex flex-col items-center justify-center gap-[30px]">
        <div className="w-full flex flex-col items-center justify-center gap-3">
          <DropdownButton
            onChange={() => {}}
            options={countries.map((country) => ({
              value: country,
              label: country,
            }))}
          />
          <div className="w-full flex flex-col gap-[6px]">
            <div className="w-full relative">
              <TextField
                type="number"
                placeholder=""
                className="w-full pl-12"
              />
              <span className="absolute inset-y-0 left-4 cursor-pointer flex items-center text-textField font-medium text-base select-none">
                +63
              </span>
            </div>
            <p className="font-regular text-xs text-nav cursor-pointer">
              We&apos;ll send you a One-Time Password (OTP) to confirm your
              number.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-3">
        <SecondaryButton onClick={onBack}>Go back</SecondaryButton>
        <PrimaryButton onClick={onNext}>Get OTP</PrimaryButton>
      </div>
      <p className="text-nav font-normal text-xs select-none hover:underline cursor-pointer">
        Skip for now
      </p>
    </form>
  );
}

function PhoneNumberVerification({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <form className="flex flex-col items-center justify-center w-full md:w-[500px] h-fit bg-white px-6 py-8 border border-buttonBorder rounded-lg gap-6">
      <div className="w-full flex flex-col items-center justify-center gap-2">
        <h2 className="font-bold text-2xl text-center text-darkGreen select-none">
          Verify your phone number
        </h2>
        <p className="font-medium text-base select-none text-nav text-center">
          Enter the 6-digit verification code that was sent to your phone
          number.
        </p>
      </div>
      <div className="min-w-full flex flex-col items-center justify-center gap-[30px]">
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="w-full flex gap-3 justify-center items-center">
            <TextField type="text" placeholder="" className="w-[32px] md:w-[42px] h-12 md:h-14 max-sm:px-2" />
            <TextField type="text" placeholder="" className="w-[32px] md:w-[42px] h-12 md:h-14 max-sm:px-2" />
            <TextField type="text" placeholder="" className="w-[32px] md:w-[42px] h-12 md:h-14 max-sm:px-2" />
            <TextField type="text" placeholder="" className="w-[32px] md:w-[42px] h-12 md:h-14 max-sm:px-2" />
            <TextField type="text" placeholder="" className="w-[32px] md:w-[42px] h-12 md:h-14 max-sm:px-2" />
            <TextField type="text" placeholder="" className="w-[32px] md:w-[42px] h-12 md:h-14 max-sm:px-2" />
          </div>
          <p className="text-nav font-normal text-base select-none hover:underline cursor-pointer">
            Resend code
          </p>
        </div>
      </div>
      <div className="w-full flex gap-3">
        <SecondaryButton onClick={onBack}>Go back</SecondaryButton>
        <PrimaryButton onClick={onNext}>Continue</PrimaryButton>
      </div>
    </form>
  );
}

function SyncContacts({}: // onBack,
// onNext,
{
  // onBack: () => void;
  // onNext: () => void;
}) {
  return (
    <form className="flex flex-col items-center justify-center w-full md:w-[500px] h-fit bg-white px-6 py-8 border border-buttonBorder rounded-lg gap-6">
      <div className="w-full flex flex-col items-center justify-center gap-2">
        <Image
          src="/assets/contacts_icon.png"
          width={80}
          height={80}
          quality={100}
          alt=""
        />
        <h2 className="font-bold text-2xl text-center text-darkGreen select-none">
          Access to Contacts
        </h2>
        <p className="font-medium text-base select-none text-nav text-center">
          Please allow Jotter access to your phonebook to seamlessly find all
          your friends.
        </p>
      </div>
      <div className="w-full flex flex-col justify-center gap-3">
        <PrimaryButton>Allow access</PrimaryButton>
        <p className="text-nav font-normal text-xs select-none hover:underline cursor-pointer text-center">
          Skip for now
        </p>
      </div>
    </form>
  );
}

export default function SignUp() {
  const steps = [
    "Account details",
    "Phone number",
    "Verification",
    "Sync contacts",
  ];
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = steps.length;
  const width = `${(100 / (totalSteps - 1)) * (activeStep - 1)}%`;

  const nextStep = () => {
    if (activeStep < totalSteps) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-12">
      <div className="max-md:hidden w-full max-w-lg mx-auto">
        <div className="flex justify-between relative">
          <div className="absolute bg-[#E0E0E7] h-[2px] w-full top-1/2 transform -translate-y-1/2 left-0"></div>
          <div
            className="absolute bg-darkGreen h-[2px]"
            style={{
              width,
              top: "50%",
              transform: "translateY(-50%)",
              transition: "width 0.4s ease",
            }}
          ></div>
          {steps.map((label, index) => {
            const step = index + 1;
            return (
              <div key={step} className="flex flex-col items-center relative">
                <div
                  className={`rounded-full flex justify-center items-center z-10 ${
                    activeStep >= step ? "bg-darkGreen" : "bg-[#E0E0E7]"
                  } h-6 w-6`}
                >
                  {activeStep > step ? (
                    <FaCheck color="white" size={12} />
                  ) : (
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activeStep >= step ? "bg-white" : "bg-transparent"
                      }`}
                    />
                  )}
                </div>
                <div
                  className={`absolute top-7 text-xs text-center font-medium ${
                    activeStep >= step ? "text-darkGreen" : "text-[#8E8E93]"
                  }`}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {activeStep === 1 && <AccountDetails onNext={nextStep} />}
      {activeStep === 2 && <PhoneNumber onBack={prevStep} onNext={nextStep} />}
      {activeStep === 3 && (
        <PhoneNumberVerification onBack={prevStep} onNext={nextStep} />
      )}
      {activeStep === 4 && <SyncContacts />}
    </div>
  );
}
