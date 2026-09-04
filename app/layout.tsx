import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIMPP - Monitoring Pembacaan Perkara",
  description: "Sistem Monitoring Pembacaan Perkara",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

