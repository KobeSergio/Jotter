"use client";

import { useEffect } from "react";
import { BsX } from "react-icons/bs";
import { IoWarning } from "react-icons/io5";

export default function SignOutModal({ isOpen, setter, onSubmit }: any) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Cleanup the class when the component unmounts
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  return (
    <>
      {isOpen && (
        <>
          <div className="overflow-x-hidden overflow-y-auto fixed w-full h-full inset-0 z-50">
            <div className="mx-auto w-full max-w-md flex items-center justify-center min-h-screen ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white">
                {/*header*/}
                <div className="flex justify-end p-6 pb-0 rounded-t-lg">
                  <BsX size={24} className="cursor-pointer" onClick={setter} />
                </div>
                {/*body*/}
                <div className="relative p-6 pt-0 overflow-y-auto flex-col">
                  <IoWarning size={40} className="text-darkGreen mx-auto mb-3" />
                  <h6 className="font-bold text-xl text-darkGreen text-center select-none">
                    Sign Out
                  </h6>
                  <p className="text-center text-darkGreen/70 font-medium text-base select-none">
                    Are you sure you want to sign out?
                  </p>
                </div>
                {/*footer*/}
                <div className="flex flex-col lg:flex-row items-center justify-center p-6 pt-0 rounded-b-lg gap-2 lg:gap-4">
                  <button
                    className="w-full lg:w-1/2 background-white outline-none focus:outline-none py-3 px-12 font-bold text-base text-darkGreen border-2 border-darkGreen rounded-lg"
                    type="button"
                    onClick={setter}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-full lg:w-1/2 px-12 py-3 flex items-center justify-center border-2 border-mainGreen bg-mainGreen hover:bg-opacity-95 hover:border-opacity-95 text-base font-bold text-center text-darkGreen rounded-lg cursor-pointer select-none"
                    type="button"
                    onClick={onSubmit}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
}
