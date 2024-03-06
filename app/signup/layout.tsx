import { Metadata } from "next";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center min-h-screen px-4 py-16">{children}</div>
  );
}
