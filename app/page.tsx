"use server";

import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { Navbar } from "@/components/Navbar";
import Content from "@/components/main/Content";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Navbar session={session} />
      <Content />
    </>
  );
}
