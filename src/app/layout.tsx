import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { LiffProvider } from "@/components/custom/LiffProvider";
import { cn } from "@/lib/utils";
import AppBar from "@/components/custom/app-bar";
import { Toaster } from "sonner";
import { Breadcrumb } from "@/components/custom/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <LiffProvider liffId={process.env.NEXT_PUBLIC_LIFF_ID!}>
          <AppBar />
          <div className="pb-1 mb-2">
            <Breadcrumb className="px-4 py-2" />
            <Separator className="w-full" />
          </div>
          <div className="mx-4 my-2">{children}</div>

          <Toaster />
        </LiffProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
