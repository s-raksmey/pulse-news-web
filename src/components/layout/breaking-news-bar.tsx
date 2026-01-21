"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import BreakingNewsBanner from "@/components/home/breaking-news-banner";
import { getTranslations, type Locale } from "@/lib/i18n";

type BreakingNewsItem = {
  id: string;
  title: string;
  slug: string;
  topic?: string | null;
  publishedAt?: string | null;
  category?: {
    slug?: string | null;
  } | null;
};

type ApiResponse = {
  success: boolean;
  data?: BreakingNewsItem[];
};

type BannerItem = {
  id: string;
  title: string;
  url: string;
  timestamp: string;
};

function articleUrl(article: BreakingNewsItem) {
  const category = article.category?.slug;
  const topic = article.topic ?? "latest";
  const slug = article.slug;
  if (!category || !slug) return "#";
  return `/${category}/${topic}/${slug}`;
}

export default function BreakingNewsBar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [breakingNews, setBreakingNews] = useState<BannerItem[]>([]);
  const t = getTranslations(locale);

  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/preview")) {
      return;
    }

    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/breaking-news", {
          cache: "no-store",
        });
        if (!response.ok) return;

        const data = (await response.json()) as ApiResponse;
        if (!active || !data.success || !data.data?.length) return;

        const mapped = data.data.map((article) => ({
          id: article.id,
          title: `${article.title}`,
          url: articleUrl(article),
          timestamp: article.publishedAt ?? new Date().toISOString(),
        }));

        setBreakingNews(mapped);
      } catch {
        if (active) {
          setBreakingNews([]);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/preview")) {
    return null;
  }

  return <BreakingNewsBanner breakingNews={breakingNews} />;
}
