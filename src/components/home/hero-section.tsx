"use client";

import { motion, type Variants } from "framer-motion";
import FeaturedArticleCard from "./featured-article-card";
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

interface HeroSectionProps {
  locale: Locale;
  featuredArticles: Article[];
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function HeroSection({ locale, featuredArticles, className = "" }: HeroSectionProps) {
  const t = getTranslations(locale);

  if (!featuredArticles || featuredArticles.length === 0) {
    return null;
  }

  // Get the main featured article and secondary articles
  const mainArticle = featuredArticles[0];
  const secondaryArticles = featuredArticles.slice(1, 5); // Up to 4 secondary articles

  return (
    <section className={`py-8 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {t.home.featuredTitle}
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            {t.home.featuredSubtitle}
          </p>
        </motion.div>

        {/* Hero Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:grid-rows-2"
        >
          {/* Main Featured Article - Takes up 2x2 space on large screens */}
          <motion.div variants={itemVariants} className="lg:col-span-2 lg:row-span-2">
            <FeaturedArticleCard
              locale={locale}
              article={mainArticle}
              size="large"
              showExcerpt={true}
              className="h-full"
            />
          </motion.div>

          {/* Secondary Articles */}
          {secondaryArticles.map((article, index) => (
            <motion.div
              key={article.id}
              variants={itemVariants}
              className="lg:col-span-1 lg:row-span-1"
            >
              <FeaturedArticleCard
                locale={locale}
                article={article}
                size="medium"
                showExcerpt={false}
                className="h-full"
              />
            </motion.div>
          ))}

          {/* Fill empty slots if we have fewer than 5 articles */}
          {Array.from({ length: Math.max(0, 4 - secondaryArticles.length) }).map((_, index) => (
            <motion.div
              key={`empty-${index}`}
              variants={itemVariants}
              className="hidden lg:block lg:col-span-1 lg:row-span-1"
            >
              <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                <p className="text-slate-400">{t.home.moreStories}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trending Topics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 rounded-lg bg-slate-50 p-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              {t.home.trendingTopicsLabel}
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                t.topics.breakingNews,
                t.topics.technology,
                t.topics.politics,
                t.topics.climateChange,
                t.topics.economy,
                t.topics.sports,
              ].map((topic) => (
                <button
                  key={topic}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  #{topic}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
