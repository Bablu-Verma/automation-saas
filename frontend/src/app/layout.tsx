import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./dangerouslyHTML.css";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/Footer";
import JSEVENT from "@/components/JSEVENT";
import { Toaster } from 'react-hot-toast';
import ReduxProvider from "@/redux-store/provider_";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mate Mind ",
  description: "Smart automation platform to manage, track, and optimize your tasks effortlessly.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark text-white`}
      >
        <JSEVENT />
        <Toaster position="top-right" />
        <ReduxProvider>
          <Navbar />
          {children}
          <Footer />
        </ReduxProvider>

      </body>
    </html>
  );
}
