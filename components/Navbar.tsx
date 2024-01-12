"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import { signOut } from "next-auth/react";

export function Navbar({ session }: { session: any }) {
  const navItemVariants = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <nav className="flex justify-between items-center py-2 px-8 lg:px-16 w-full border-b border-gray-200">
      <Link href={"/"} className="flex items-center gap-2 z-10">
        {/* <Image src="/assets/logo.svg" width={50} height={50} alt={"logo"} /> */}
        <h2 className="text-green-900 text-lg font-semibold tracking-[0.4px] cursor-pointer">
          Jotter
        </h2>
      </Link>
      <motion.div
        className="hidden lg:flex items-center gap-7"
        initial="initial"
        animate="animate"
        variants={containerVariants}
      >
        <motion.p
          className="text-[#1D1D1F] text-base font-semibold tracking-[-0.4px] cursor-pointer hover:underline underline-offset-4"
          initial="initial"
          animate="animate"
          variants={navItemVariants}
          onClick={() => {
            let section = document.getElementById("faqs");
            section &&
              section.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            signOut();
          }}
        >
          Logout
        </motion.p>
      </motion.div>
      {/* Show hamburger icon/sidebar component when on mobile to tablet screen size */}
      <Sidebar />
    </nav>
  );
}
