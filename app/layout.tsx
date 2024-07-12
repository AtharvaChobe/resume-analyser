import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ai.CVscan",
  description: "Get your resume analyzed by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
