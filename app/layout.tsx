import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthCheck from "@/components/AuthCheck";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '900'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "EduNexus - Academic Repository",
  description: "A modern academic repository platform for educational resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${poppins.variable} font-sans antialiased`}
          style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
        >
          <AuthCheck />
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
