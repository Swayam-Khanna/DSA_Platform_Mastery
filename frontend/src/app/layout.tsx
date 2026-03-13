import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@/components/providers/SocketProvider";
import AuthInitializer from "@/components/AuthInitializer";
import { MatrixRainBackground } from "@/components/ui/MatrixRainBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DSA Mastery | Master Data Structures & Algorithms",
  description:
    "The ultimate DSA learning platform. Solve problems, track streaks, compete on leaderboards, and get AI-powered help to crack your dream interview.",
  keywords: ["DSA", "algorithms", "data structures", "coding interview", "LeetCode", "competitive programming"],
  openGraph: {
    title: "DSA Mastery Platform",
    description: "Master DSA with AI assistance, structured roadmaps, and gamified learning.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased relative min-h-screen z-0">
        <SocketProvider>
          <MatrixRainBackground />
          <div className="relative z-10">
            <AuthInitializer />
            {children}
          </div>
          <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(15, 15, 40, 0.95)",
              color: "#f1f5f9",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "12px",
              backdropFilter: "blur(20px)",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: { primary: "#34d399", secondary: "transparent" },
            },
            error: {
              iconTheme: { primary: "#f87171", secondary: "transparent" },
            },
          }}
        />
        </SocketProvider>
      </body>
    </html>
  );
}
