import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Español - スペイン語学習",
  description: "初心者向けスペイン語学習アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full bg-amber-50 text-gray-800">{children}</body>
    </html>
  );
}
