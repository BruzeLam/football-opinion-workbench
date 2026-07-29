import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const forwardedProto = headerList.get("x-forwarded-proto");
  const protocol = forwardedProto ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.jpg`;

  return {
    title: "开球 · 足球观点工作台",
    description: "把比赛事实转化为有观点、有节奏、能落地的原创中文足球口播。",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "开球 · 足球观点工作台",
      description: "把一场比赛，变成一个有力的观点。",
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "开球 · 足球观点工作台",
      description: "把一场比赛，变成一个有力的观点。",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
