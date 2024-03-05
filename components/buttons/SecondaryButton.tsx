import React, { ButtonHTMLAttributes } from "react";

export default function SecondaryButton({
  children,
  className = " ",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      {...props}
      className={`${className} w-full flex justify-center px-4 py-3 gap-2 font-bold text-base text-darkGreen select-none cursor-pointer bg-white border border-buttonBorder rounded-lg hover:bg-gray/20`}
    >
      {children}
    </button>
  );
}
