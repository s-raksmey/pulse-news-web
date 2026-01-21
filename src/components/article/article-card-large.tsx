"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, User, MessageCircle, Share2 } from "lucide-react";
import { formatShortDate } from "@/lib/date";
import { getTranslations, type Locale } from "@/lib/i18n";

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  coverImage?: {
    url: string;
    alt?: string;
  };
  author?: {
    name: string;
    avatar?: string;
  };
  category?: {
    name: string;
    slug: string;
    color?: string;
  };
  topic?: string;
  publishedAt: string;
  readTime?: number;
  commentsCount?: number;
}

interface ArticleCardLargeProps {
  article: Article;
  layout?: "vertical" | "horizontal";
  showActions?: boolean;
  className?: string;
  locale?: Locale;
}

export default function ArticleCardLarge({
  article,
  locale,
  layout = "vertical",
  showActions = true,
  className = "",
}: ArticleCardLargeProps) {
  const articleUrl = `/${article.category?.slug || "news"}/${article.topic || "latest"}/${article.slug}`;
  const resolvedLocale = locale ?? "en";
  const t = getTranslations(resolvedLocale);
  const formattedDate =
    formatShortDate(article.publishedAt, resolvedLocale, { includeYear: true }) ??
    t.article.unknownDate;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.origin + articleUrl,
      });
    }
  };

  if (layout === "horizontal") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`group overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative h-64 sm:h-auto sm:w-1/2">
            <Link href={articleUrl}>
              {article.coverImage?.url ? (
                <Image
                  src={article.coverImage.url}
                  alt={article.coverImage.alt || article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-200">
                  <span className="text-slate-400">{t.article.noImage}</span>
                </div>
              )}
            </Link>
            
            {/* Category badge */}
            {article.category && (
              <div className="absolute left-4 top-4">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
                  style={{ backgroundColor: article.category.color || "#3B82F6" }}
                >
                  {article.category.name}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-6 sm:w-1/2">
            <div>
              {/* Meta info */}
              <div className="mb-3 flex items-center gap-4 text-sm text-slate-500">
                {article.author && (
                  <div className="flex items-center gap-2">
                    {article.author.avatar ? (
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span>{article.author.name}</span>
                  </div>
                )}
                <span>{formattedDate}</span>
                {article.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime} {t.article.minLabel}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <Link href={articleUrl}>
                <h2 className="mb-3 text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-blue-600">
                  {article.title}
                </h2>
              </Link>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="mb-4 text-slate-600 line-clamp-3">
                  {article.excerpt}
                </p>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center justify-between">
                <Link
                  href={articleUrl}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {t.article.readMore} →
                </Link>
                
                <div className="flex items-center gap-3">
                  {article.commentsCount !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <MessageCircle className="h-4 w-4" />
                      <span>{article.commentsCount}</span>
                    </div>
                  )}
                  <button
                    onClick={handleShare}
                    className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label={t.article.shareLabel}
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.article>
    );
  }

  // Vertical layout
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`group overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}
    >
      {/* Image */}
      <div className="relative h-64 sm:h-80">
        <Link href={articleUrl}>
          {article.coverImage?.url ? (
            <Image
              src={article.coverImage.url}
              alt={article.coverImage.alt || article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-200">
              <span className="text-slate-400">{t.article.noImage}</span>
            </div>
          )}
        </Link>
        
        {/* Category badge */}
        {article.category && (
          <div className="absolute left-4 top-4">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
              style={{ backgroundColor: article.category.color || "#3B82F6" }}
            >
              {article.category.name}
            </span>
          </div>
        )}

        {/* Read time badge */}
        {article.readTime && (
          <div className="absolute right-4 top-4">
            <span className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {article.readTime} {t.article.minLabel}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta info */}
        <div className="mb-3 flex items-center gap-4 text-sm text-slate-500">
          {article.author && (
            <div className="flex items-center gap-2">
              {article.author.avatar ? (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span>{article.author.name}</span>
            </div>
          )}
          <span>{formattedDate}</span>
        </div>

        {/* Title */}
        <Link href={articleUrl}>
          <h2 className="mb-3 text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-blue-600 sm:text-2xl">
            {article.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="mb-4 text-slate-600 line-clamp-3">
            {article.excerpt}
          </p>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between">
            <Link
              href={articleUrl}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {t.article.readMore} →
            </Link>
            
            <div className="flex items-center gap-3">
              {article.commentsCount !== undefined && (
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <MessageCircle className="h-4 w-4" />
                  <span>{article.commentsCount}</span>
                </div>
              )}
              <button
                onClick={handleShare}
                className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label={t.article.shareLabel}
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
