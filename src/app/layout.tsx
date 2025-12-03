import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "@/lib/chat-context";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anysearch",
  description: "search any link",
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
        <AuthProvider>
          <AuthGuard>
            <ChatProvider>
              {children}
            </ChatProvider>
          </AuthGuard>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
