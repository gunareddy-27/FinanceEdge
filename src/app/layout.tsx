import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaxPal - Smart Finance",
  description: "Manage income, track expenses, and estimate taxes.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png"
  }
};

import { ToastProvider } from "@/app/components/ToastProvider";

import AIChatbot from "@/app/components/AIChatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
          <AIChatbot />
        </ToastProvider>
      </body>
    </html>
  );
}
