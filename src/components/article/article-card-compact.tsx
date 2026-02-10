"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, TrendingUp } from "lucide-react";
import { formatShortDate } from "@/lib/date";
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

interface ArticleCardCompactProps {
  article: Article;
  index?: number;
  showImage?: boolean;
  showCategory?: boolean;
  showViews?: boolean;
  className?: string;
  locale: Locale;
}

export default function ArticleCardCompact({
  article,
  locale,
  index,
  showImage = true,
  showCategory = false,
  showViews = false,
  className = "",
}: ArticleCardCompactProps) {
  const articleUrl = `/${article.category?.slug || "news"}/${article.topic || "latest"}/${article.slug}`;
  const t = getTranslations(locale);
  const formattedDate =
    formatShortDate(article.publishedAt, locale) ?? t.article.unknownDate;

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index ? index * 0.1 : 0 }}
      className={`group ${className}`}
    >
      <Link href={articleUrl} className="block">
        <div className="flex gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50">
          {/* Index number for trending lists */}
          {index !== undefined && (
            <div className="flex-shrink-0">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                {index + 1}
              </span>
            </div>
          )}

          {/* Image */}
          {showImage && article.coverImage?.url && (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={article.coverImage.url}
                alt={article.coverImage.alt || article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="64px"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Category */}
            {showCategory && article.category && (
              <div className="mb-1">
                <span
                  className="inline-block rounded px-2 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: article.category.color || "#3B82F6" }}
                >
                  {article.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="mb-2 text-sm font-semibold leading-tight transition-colors group-hover:text-blue-600 line-clamp-2" style={{ color: '#385CF5' }}>
              {article.title}
            </h3>

            {/* Meta info */}
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{formattedDate}</span>
              
              {article.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{article.readTime} {t.article.minLabel}</span>
                </div>
              )}

              {showViews && article.views && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{formatViews(article.views)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
