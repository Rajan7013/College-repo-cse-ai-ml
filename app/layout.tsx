import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EduNexus",
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png", // Reusing 192 for simplicity, ideally should be specific size
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // App-like feel
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
          className={`${poppins.variable} font-sans antialiased pb-20 md:pb-0`} // Added pb-20 for bottom nav space
          style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
        >
          <AuthCheck />
          {/* Hide Default Navbar on Mobile since we use BottomNav, but keep it if user prefers top nav too. 
              User asked for "mobile-like", so usually we hide top nav menu items but keep logo. 
              The Navbar component already has a mobile menu; we might want to keep logo but hide menu.
              For now, we leave Navbar as is (it collapses) and add BottomNav. */}
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <BottomNav />
          <InstallPrompt />
        </body>
      </html>
    </ClerkProvider>
  );
}
