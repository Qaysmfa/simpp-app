import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monitoring Pembacaan Tuntutan, Putusan Pidana Mati, Seumur Hidup dan Penjara 20 Tahun dalam Perkara Narkotika",
  description: "Monitoring Pembacaan Tuntutan, Putusan Pidana Mati, Seumur Hidup dan Penjara 20 Tahun dalam Perkara Narkotika",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
