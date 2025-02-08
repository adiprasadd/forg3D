import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoryForge | IP Blockchain Marketplace",
  description:
    "Transform intelligence into Programmable IP assets. Trade IP in a global market for AI training and remixing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white`}
      >
        <div className="mx-auto max-w-7xl">{children}</div>
      </body>
    </html>
  );
}
