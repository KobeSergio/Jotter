"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import Hamburger from "./Hamburger";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const hiddenVariants = {
    visible: {
      transition: { staggerChildren: 0.1, duration: 0.3 },
      y: 0,
    },
    hidden: {
      y:
        typeof window !== "undefined" && window.innerWidth < 1024
          ? -window.innerHeight
          : 0,
    },
  };
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={hiddenVariants}
            transition={{ duration: 0.5 }}
            className="flex lg:hidden xs:gap-8 font-semibold lg:h-auto lg:py-0 lg:relative duration-300 h-screen left-0 bg-[#EFF4F1] py-4 pb-6 text-black items-center justify-center lg:text-[#1D1D1F] absolute top-0 text-center flex-col lg:flex-row text-2xl opacity-1 lg:font-medium w-full gap-3 md:gap-16 lg:gap-16"
          >
            <motion.li
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -50 },
              }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                let section = document.getElementById("how-we-work");
                setIsOpen(false);
                section &&
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
              className="disable-text-selection block py-2 pr-4 pl-3 text-[#1D1D1F] hover:underline underline-offset-8 cursor-pointer"
            >
              How We Work
            </motion.li>
            <motion.li
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -60 },
              }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                let section = document.getElementById("catalog");
                setIsOpen(false);
                section &&
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
              className="disable-text-selection block py-2 pr-4 pl-3 text-[#1D1D1F] hover:underline underline-offset-8 cursor-pointer"
            >
              Catalog
            </motion.li>
            <motion.li
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -70 },
              }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                let section = document.getElementById("why-us");
                setIsOpen(false);
                section &&
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
              className="disable-text-selection block py-2 pr-4 pl-3 text-[#1D1D1F] hover:underline underline-offset-8 cursor-pointer"
            >
              Why Us
            </motion.li>
            <motion.li
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -80 },
              }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                let section = document.getElementById("clients");
                setIsOpen(false);
                section &&
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
              className="disable-text-selection block py-2 pr-4 pl-3 text-[#1D1D1F] hover:underline underline-offset-8 cursor-pointer"
            >
              Clients
            </motion.li>
            <motion.li
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -90 },
              }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                let section = document.getElementById("faqs");
                setIsOpen(false);
                section &&
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
              className="disable-text-selection block py-2 pr-4 pl-3 text-[#1D1D1F] hover:underline underline-offset-8 cursor-pointer"
            >
              FAQs
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
      <div className="z-40 lg:hidden flex items-center">
        <Hamburger toggle={() => setIsOpen((prev) => !prev)} isOpen={isOpen} />
      </div>
    </>
  );
}
