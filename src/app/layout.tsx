import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Landing Studio",
  description: "AI 기반 랜딩페이지 빌더",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="ko">
      <body>{children}</body>
    </html>
  );
}
