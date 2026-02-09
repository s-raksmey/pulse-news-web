"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Article } from "@/types/article";
import { getTranslations, type Locale } from "@/lib/i18n";
import { HomePageSkeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import HeroSection from "./hero-section";
import CategorySection from "./category-section";
import Sidebar from "@/components/layout/sidebar";

interface CategoryHomeProps {
  locale: Locale;
  featuredArticles: Article[];
  categoryData: {
    world: Article[];
    tech: Article[];
    business: Article[];
    politics: Article[];
    sports: Article[];
    culture: Article[];
  };
  trendingArticles: Article[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const categories = [
  { key: 'world', title: 'World', slug: 'world' },
  { key: 'tech', title: 'Technology', slug: 'tech' },
  { key: 'business', title: 'Business', slug: 'business' },
  { key: 'politics', title: 'Politics', slug: 'politics' },
  { key: 'sports', title: 'Sports', slug: 'sports' },
  { key: 'culture', title: 'Culture', slug: 'culture' },
];

export default function CategoryHome({
  locale,
  featuredArticles,
  categoryData,
  trendingArticles,
}: CategoryHomeProps) {
  const t = getTranslations(locale);
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Track client-side hydration
  useEffect(() => {
    setIsClient(true);
    
    // Check if we have any data
    const hasAnyData = featuredArticles?.length > 0 || 
      Object.values(categoryData).some(articles => articles?.length > 0);
    
    if (!hasAnyData) {
      setHasError(true);
    }
  }, [featuredArticles, categoryData]);

  // Show loading skeleton during SSR
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

  // Transform articles for hero section
  const transformedFeatured = featuredArticles?.map(a => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    slug: a.slug,
    coverImage: a.coverImageUrl ? {
      url: a.coverImageUrl,
      alt: a.title,
    } : undefined,
    author: a.authorName ? {
      name: a.authorName,
      avatar: undefined,
    } : undefined,
    category: a.category ? {
      name: a.category.name,
      slug: a.category.slug,
      color: "#3B82F6",
    } : undefined,
    topic: a.topic || "latest",
    publishedAt: a.publishedAt,
    readTime: 5,
    views: a.viewCount || 0,
    commentsCount: 0,
  })) || [];

  // Transform trending articles
  const transformedTrending = trendingArticles?.map(a => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    slug: a.slug,
    coverImage: a.coverImageUrl ? {
      url: a.coverImageUrl,
      alt: a.title,
    } : undefined,
    author: a.authorName ? {
      name: a.authorName,
      avatar: undefined,
    } : undefined,
    category: a.category ? {
      name: a.category.name,
      slug: a.category.slug,
      color: "#3B82F6",
    } : undefined,
    topic: a.topic || "latest",
    publishedAt: a.publishedAt,
    readTime: 5,
    views: a.viewCount || 0,
    commentsCount: 0,
  })) || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Simplified Hero Section - No images, just text */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Stay Informed
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Get the latest news and insights from around the world in a clean, distraction-free format.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Simplified Layout */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Featured Articles - Text Only */}
          {transformedFeatured.length > 0 && (
            <motion.section variants={fadeUp}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
                Featured Stories
              </h2>
              <div className="space-y-6">
                {transformedFeatured.slice(0, 3).map((article, index) => (
                  <article key={article.id} className="border-b border-slate-100 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl font-bold text-slate-300 mt-1">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
                          <a href={`/article/${article.slug}`}>
                            {article.title}
                          </a>
                        </h3>
                        {article.excerpt && (
                          <p className="text-slate-600 mb-3 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          {article.category && (
                            <span className="font-medium text-blue-600">
                              {article.category.name}
                            </span>
                          )}
                          <span>
                            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>
          )}

          {/* Latest News - Simplified */}
          <motion.section variants={fadeUp}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
              Latest News
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Combine articles from top 3 categories only */}
              {[
                ...categoryData.world.slice(0, 2),
                ...categoryData.tech.slice(0, 2),
                ...categoryData.business.slice(0, 2),
              ].slice(0, 6).map((article) => (
                <article key={article.id} className="group">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    <a href={`/article/${article.slug}`}>
                      {article.title}
                    </a>
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {article.category && (
                      <span className="font-medium text-blue-600">
                        {article.category.name}
                      </span>
                    )}
                    <span>
                      {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>

          {/* Simple Categories Navigation */}
          <motion.section variants={fadeUp}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.slice(0, 6).map((category) => (
                <a
                  key={category.key}
                  href={`/${category.slug}`}
                  className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                    {category.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {categoryData[category.key as keyof typeof categoryData]?.length || 0} articles
                  </p>
                </a>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}
