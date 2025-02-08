import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your app description",
  icons: {
    icon: "/logo.png", 
    apple: "/logo.png", 
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navigation />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
