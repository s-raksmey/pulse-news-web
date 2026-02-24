import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { fontKhmerDigital } from "@/lib/font";
import BreakingNewsBar from "@/components/layout/breaking-news-bar";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "Pulse News",
  description: "News website with CMS dashboard and Editor.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get("locale")?.value;
  const locale = requestedLocale === "km" ? "km" : "en";

  return (
    <html lang={locale} data-locale={locale} className={fontKhmerDigital.variable}>
      <body className={`min-h-screen bg-white text-slate-900 ${fontKhmerDigital.className}`}>
        <Header locale={locale} />
        <BreakingNewsBar locale={locale} />
        <div className="min-h-[calc(100vh-140px)]">{children}</div>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
