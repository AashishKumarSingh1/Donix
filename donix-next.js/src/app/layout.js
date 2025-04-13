import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Theme_Providers } from "../utility/Theme_Providers";
import { Toaster } from "react-hot-toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Donix",
  description: "Your One Act Can Save Multiple Lives!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning
      ><Toaster position="top-right" reverseOrder={false} />
        <Theme_Providers>
        {children}
        </Theme_Providers>
      </body>
    </html>
  );
}
