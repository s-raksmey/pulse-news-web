"use client";

import { motion } from "framer-motion";
import { TrendingUp, Flame } from "lucide-react";
import ArticleCardCompact from "@/components/article/article-card-compact";
import { getTranslations, type Locale } from "@/lib/i18n";

interface Article {
  id: string;
  title: string;
  slug: string;
  coverImage?: {
    url: string;
    alt?: string;
  };
  category?: {
    name: string;
    slug: string;
    color?: string;
  };
  topic?: string;
  publishedAt: string;
  readTime?: number;
  views?: number;
}

interface TrendingWidgetProps {
  locale: Locale;
  articles: Article[];
  title?: string;
  showImages?: boolean;
  maxItems?: number;
  className?: string;
}

export default function TrendingWidget({
  locale,
  articles,
  title,
  showImages = true,
  maxItems = 5,
  className = "",
}: TrendingWidgetProps) {
  const t = getTranslations(locale);
  const heading = title ?? t.trendingWidget.title;
  const displayArticles = articles.slice(0, maxItems);

  if (displayArticles.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl bg-white p-6 shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-bold text-slate-900">{heading}</h3>
        </div>
        <TrendingUp className="h-4 w-4 text-orange-500" />
      </div>

      {/* Articles List */}
      <div className="space-y-1">
        {displayArticles.map((article, index) => (
          <ArticleCardCompact
            key={article.id}
            article={article}
            index={index}
            locale={locale}
            showImage={showImages}
            showViews={true}
            className="border-b border-slate-100 last:border-b-0"
          />
        ))}
      </div>

      {/* View All Link */}
      {articles.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button className="w-full rounded-lg bg-slate-50 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100">
            {t.sidebar.viewAllTrending}
          </button>
        </div>
      )}
    </motion.div>
  );
}
