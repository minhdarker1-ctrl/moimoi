import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { db } from "@/lib/db";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await db.site.findUnique({ where: { id: 1 } }).catch(() => null);
  const title = site?.seoTitle || site?.name || "Website";
  const description = site?.seoDescription || "";
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  const images = site?.ogImageUrl ? [site.ogImageUrl] : undefined;

  return {
    title,
    description,
    keywords: site?.seoKeywords || undefined,
    metadataBase: base ? new URL(base) : undefined,
    alternates: { canonical: "/" },
    icons: site?.faviconUrl ? { icon: site.faviconUrl, apple: site.faviconUrl } : undefined,
    openGraph: { type: "website", title, description, url: "/", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

// Đặt data-theme trước khi paint để không flash màu sáng khi đang ở dark mode.
const themeScript = `try{if(localStorage.getItem("vt-theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: themeScript đặt data-theme trước khi React hydrate,
    // nên attribute trên client khác server. Đây là chủ ý, không phải bug.
    <html lang="vi" className={quicksand.variable} suppressHydrationWarning>
      <head>
        {/* Bản gốc dùng cả 2 bộ icon; preconnect để không chặn render. */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
