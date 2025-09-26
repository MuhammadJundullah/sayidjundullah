import type { Metadata } from "next";
import { Source_Sans_3, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./_sections/Footer";

const fontSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sayid's Portofolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased text-gray-900 dark:bg-gray-800`}>
        <div className="min-h-screen flex flex-col mx-auto max-w-6xl">
          <div className="flex-1 flex flex-col items-center justify-center pb-10">
            {children}
          </div>
          <div className="sm:w-full border-t sm:mx-0 mx-5">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
