import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { db } from "@/lib/db";
import ScenicBackground from "@/components/ScenicBackground";
import SnowEffect from "@/components/SnowEffect";
import MusicPlayer from "@/components/MusicPlayer";
import FloatingSupportHub from "@/components/FloatingSupportHub";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await db.site.findUnique({ where: { id: 1 } }).catch(() => null);
  const title = site?.seoTitle || (site?.name ? `${site.name} - Giải Pháp Công Nghệ & Tiện Ích Game Mobile` : "MinSr - Giải Pháp Công Nghệ & Tiện Ích Game Mobile");
  
  // Tự động làm sạch các từ khóa nhạy cảm đề phòng database chứa từ khóa khiến Facebook/TikTok/Zalo cắm cờ link
  const rawDesc = site?.seoDescription || "Hệ thống chia sẻ tài nguyên, hướng dẫn tối ưu độ nhạy game và giải pháp tiện ích công nghệ iOS an toàn, bảo mật 24/7.";
  const description = rawDesc.replace(/\b(hack|mod|cheat|crack|bypass|unlock\s*id)\b/gi, "tối ưu").trim();
  
  const rawKeywords = site?.seoKeywords || "minsr, cong nghe ios, do nhay ff, tien ich game, ung dung ios";
  const keywords = rawKeywords.replace(/\b(hack|mod|cheat|crack|bypass)\b/gi, "").trim();
  
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  const images = site?.ogImageUrl ? [site.ogImageUrl] : undefined;

  return {
    title,
    description,
    keywords,
    metadataBase: base ? new URL(base) : undefined,
    alternates: { canonical: "/" },
    icons: site?.faviconUrl ? { icon: site.faviconUrl, apple: site.faviconUrl } : undefined,
    openGraph: { 
      type: "website", 
      title, 
      description, 
      url: "/", 
      images,
      siteName: site?.name || "MinSr",
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, socials] = await Promise.all([
    db.site.findUnique({ where: { id: 1 } }).catch(() => null),
    db.social.findMany({ where: { visible: true }, orderBy: { order: "asc" } }).catch(() => []),
  ]);

  return (
    <html lang="vi" className={`${quicksand.variable} dark`} data-theme="dark">
      <head>
        {/* Bộ icon FontAwesome & Bootstrap Icons; preconnect để không chặn render. */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        />
      </head>
      <body className="vthangios-dark">
        <ScenicBackground />
        <SnowEffect />
        <MusicPlayer />
        <div className="app-page-wrapper" style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
          {children}
        </div>
        <FloatingSupportHub
          siteName={site?.name || "MinSr"}
          socials={socials.map((s) => ({
            url: s.url,
            iconUrl: s.iconUrl,
          }))}
        />
      </body>
    </html>
  );
}
