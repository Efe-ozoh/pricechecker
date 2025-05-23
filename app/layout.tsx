import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Inter, Sail } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({subsets: ['latin']});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Price Market",
  description: "Get the latest and cheapest prices online, from the lowest prices to the highest prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="max-w-10xl mx-w-10xl">
          <Navbar  />
          {children}
        </main>
        
      </body>
    </html>
  );
}
