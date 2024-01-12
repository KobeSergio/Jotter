"use server";

import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Content from "@/components/main/Content";
import NavDesktop from "@/components/NavDesktop";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex">
      <NavDesktop session={session} />
      <Content />
    </div>
  );
}
