import type { Metadata } from "next";
import "./globals.css";
import { PreferencesProvider } from "@/features/preferences/PreferencesContext";

export const metadata: Metadata = {
  title: "Stands — AI Co-host for Live Cricket Watch-Alongs",
  description:
    "An AI co-host that sits inside a live cricket watch-along room. Catches up late joiners in 3 lines, explains any moment, answers top questions, and guides creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-stadium-900 text-slate-100 min-h-screen antialiased">
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
