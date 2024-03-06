"use client";

import React, { ButtonHTMLAttributes, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
export default function PrimaryButton({
  className = " ",
  options,
  onChange,
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full relative">
      <select
        title="Select your country"
        onChange={onChange}
        onClick={() => setIsOpen(!isOpen)}
        className={`${className} w-full flex px-4 py-3 gap-2 font-regular text-base text-textField select-none cursor-pointer bg-white border border-buttonBorder rounded-lg outline-none appearance-none`}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-4 cursor-pointer flex items-center">
        <IoChevronDownOutline
          color="#213D39"
          size={16}
          className={`transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </div>
  );
}
