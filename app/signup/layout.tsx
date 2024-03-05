import { Metadata } from "next";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-screen">{children}</div>
  );
}
