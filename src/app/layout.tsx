import type { Metadata } from "next";
import "./globals.css";
import { MockModeIndicator } from "@/components/MockModeIndicator";

export const metadata: Metadata = {
  title: "보내기 전에 | Before Send",
  description: "감정적 메시지를 보내기 전에 톤을 분석하고, 관계를 망치지 않는 3가지 수정안을 제공하는 AI 서비스",
  keywords: ["메시지 분석", "톤 분석", "AI", "커뮤니케이션", "관계"],
  openGraph: {
    title: "보내기 전에 | Before Send",
    description: "전송 전 마지막 체크 - 감정적 메시지를 보내기 전에 톤을 분석하고 수정안을 받아보세요",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <MockModeIndicator />
      </body>
    </html>
  );
}

