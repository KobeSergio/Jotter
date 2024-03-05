import React, { ButtonHTMLAttributes } from "react";
export default function PrimaryButton({
  children,
  className = " ",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      {...props}
      className={`${className} w-full h-fit border-darkGreen bg-darkGreen hover:border-opacity-95 hover:bg-opacity-95 font-bold text-center text-base text-white px-4 py-3 rounded-lg flex items-center justify-center select-none`}
    >
      {children}
    </button>
  );
}
