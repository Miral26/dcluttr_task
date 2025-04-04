import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";

const mulish = Mulish({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dcluttr Dashboard",
  description: "Analytics Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={mulish.className}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 overflow-auto h-screen pt-5 px-5 bg-white">{children}</div>
        </div>
      </body>
    </html>
  );
}
