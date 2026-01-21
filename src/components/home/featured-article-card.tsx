"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, User, ArrowRight } from "lucide-react";
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
}

interface FeaturedArticleCardProps {
  article: Article;
  size?: "large" | "medium" | "small";
  layout?: "vertical" | "horizontal";
  showExcerpt?: boolean;
  className?: string;
  locale: Locale;
}

export default function FeaturedArticleCard({
  article,
  locale,
  size = "large",
  layout = "vertical",
  showExcerpt = true,
  className = "",
}: FeaturedArticleCardProps) {
  const articleUrl = `/${article.category?.slug || "news"}/${article.topic || "latest"}/${article.slug}`;
  const t = getTranslations(locale);
  const formattedDate =
    formatShortDate(article.publishedAt, locale, { includeYear: true }) ??
    t.article.unknownDate;

  const sizeClasses = {
    large: "col-span-2 row-span-2",
    medium: "col-span-1 row-span-1",
    small: "col-span-1 row-span-1",
  };

  const imageClasses = {
    large: layout === "vertical" ? "h-80 sm:h-96" : "h-64 sm:h-80",
    medium: "h-48 sm:h-56",
    small: "h-40 sm:h-48",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${sizeClasses[size]} ${className}`}
    >
      <Link href={articleUrl} className="block h-full">
        {/* Image Container */}
        <div className={`relative overflow-hidden ${imageClasses[size]}`}>
          {article.coverImage?.url ? (
            <Image
              src={article.coverImage.url}
              alt={article.coverImage.alt || article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={size === "large" ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              priority={size === "large"}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-200">
              <span className="text-slate-400">{t.article.noImage}</span>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
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
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="space-y-3">
            {/* Meta info */}
            <div className="flex items-center gap-4 text-sm text-white/80">
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
            <h2 className={`font-bold leading-tight text-white group-hover:text-blue-200 transition-colors ${
              size === "large" ? "text-2xl sm:text-3xl" : size === "medium" ? "text-xl" : "text-lg"
            }`}>
              {article.title}
            </h2>

            {/* Excerpt */}
            {showExcerpt && article.excerpt && size !== "small" && (
              <p className="text-sm text-white/90 line-clamp-2 sm:line-clamp-3">
                {article.excerpt}
              </p>
            )}

            {/* Read more indicator */}
            <div className="flex items-center gap-2 text-sm font-medium text-blue-200 opacity-0 transition-opacity group-hover:opacity-100">
              <span>{t.article.readMore}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
