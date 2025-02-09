import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { WalletProvider } from "./components/WalletProvider";
import { WalletDebug } from "./components/WalletDebug";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "StoryForge",
  description: "3D Model Marketplace with Story Protocol Integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <WalletProvider>
            <div className="min-h-screen bg-gray-900 text-white">
              <Navigation />
              <main className="container mx-auto px-4 py-8">{children}</main>
              <Footer />
              <WalletDebug />
            </div>
          </WalletProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
