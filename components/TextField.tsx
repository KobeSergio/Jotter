import React from "react";

export default function TextField({
  className = "w-full",
  type,
  placeholder,
  onClick
}: {
  className?: string;
  type: string;
  placeholder: string;
  onClick?: () => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onClick={onClick}
      className={`${className} flex px-4 py-3 gap-2 font-regular text-base placeholder:text-textField text-darkGreen select-none cursor-pointer bg-white border border-buttonBorder rounded-lg active:border-gray`}
    />
  );
}
