import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaxMan - Freelance Finance",
  description: "Manage income, track expenses, and estimate taxes.",
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
