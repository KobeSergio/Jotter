"use server";

import { authOptions } from "@/lib/functions/authOptions";
import { getServerSession } from "next-auth";

export async function getServer() {
  const session = await getServerSession(authOptions);
  return session;
}
