"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useState, useEffect } from "react";
import HeroSection from "./hero-section";
import Sidebar from "@/components/layout/sidebar";
import ArticleCardLarge from "@/components/article/article-card-large";
import { getTranslations, type Locale } from "@/lib/i18n";
import { HomePageSkeleton } from "@/components/ui/skeleton";
import { Article } from "@/types/article";
import { useArticles } from "@/hooks/useGraphQL";
import { AlertCircle, RefreshCw } from "lucide-react";

/* =========================
   Motion Variants (SAFE)
========================= */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* =========================
   Component
========================= */
export default function HomePageClient({
  locale,
  topStories,
  editorsPicks,
  trending,
}: {
  locale: Locale;
  topStories: Article[];
  editorsPicks: Article[];
  trending: Article[];
}) {
  const t = getTranslations(locale);
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Track client-side hydration
  useEffect(() => {
    setIsClient(true);
    
    // Check if we have any data, if not, it might be an error
    if (!topStories?.length && !editorsPicks?.length && !trending?.length) {
      setHasError(true);
    }
  }, [topStories, editorsPicks, trending]);

  // Show loading skeleton during SSR or if no data
  if (!isClient) {
    return <HomePageSkeleton />;
  }

  // Error state with retry option
  if (hasError) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Unable to Load Content</h2>
          <p className="text-slate-600">
            We're having trouble loading the latest news. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Page
          </button>
        </div>
      </main>
    );
  }

  // Helper function to generate deterministic values based on article ID
  const generateDeterministicValue = (id: string, seed: number, min: number, max: number) => {
    let hash = 0;
    const str = id + seed.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % (max - min + 1) + min;
  };

  // Transform articles for new components
  const transformedArticles = (articles: Article[]) => 
    articles.map(a => ({
      id: a.id,
      title: a.title,
      excerpt: a.excerpt,
      slug: a.slug,
      coverImage: a.coverImage ? {
        url: a.coverImage.url,
        alt: a.title,
      } : undefined,
      author: a.author ? {
        name: a.author.name,
        avatar: a.author.avatar,
      } : undefined,
      category: a.category ? {
        name: a.category.name,
        slug: a.category.slug,
        color: a.category.color || "#3B82F6",
      } : undefined,
      topic: a.topic || "latest",
      publishedAt: a.publishedAt,
      readTime: a.readTime || generateDeterministicValue(a.id, 1, 3, 12),
      views: generateDeterministicValue(a.id, 2, 1000, 10000),
      commentsCount: generateDeterministicValue(a.id, 3, 0, 50),
    }));

  const featuredArticles = transformedArticles(topStories.slice(0, 5));
  const editorPicksTransformed = transformedArticles(editorsPicks);
  const trendingTransformed = transformedArticles(trending);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      {featuredArticles.length > 0 && (
        <HeroSection locale={locale} featuredArticles={featuredArticles} />
      )}

      {/* Main Content Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Editor's Picks Section */}
            {editorPicksTransformed.length > 0 && (
              <motion.section
                variants={stagger}
                initial="hidden"
                animate="show"
                className="space-y-8"
              >
                <motion.div variants={fadeUp}>
                  <h2 className="text-3xl font-bold text-slate-900">{t.home.editorsPicksTitle}</h2>
                  <p className="mt-2 text-lg text-slate-600">
                    {t.home.editorsPicksSubtitle}
                  </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                  {editorPicksTransformed.slice(0, 4).map((article, index) => (
                    <motion.div key={article.id} variants={fadeUp}>
                      <ArticleCardLarge
                        locale={locale}
                        article={article}
                        layout="vertical"
                        className="h-full"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Latest News Section */}
            <motion.section
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              <motion.div variants={fadeUp}>
                <h2 className="text-3xl font-bold text-slate-900">{t.home.latestNewsTitle}</h2>
                <p className="mt-2 text-lg text-slate-600">
                  {t.home.latestNewsSubtitle}
                </p>
              </motion.div>

              <div className="space-y-6">
                {topStories.slice(5, 10).map((article, index) => {
                  const transformed = transformedArticles([article])[0];
                  return (
                    <motion.div key={article.id} variants={fadeUp}>
                      <ArticleCardLarge
                        locale={locale}
                        article={transformed}
                        layout="horizontal"
                        className="w-full"
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <Sidebar
                locale={locale}
                trendingArticles={trendingTransformed}
                showNewsletter={true}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
