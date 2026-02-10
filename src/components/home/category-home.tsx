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
    <main className="min-h-screen bg-gray-50">
      {/* Compact Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight">
              PULSE
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto font-light">
              Breaking news, insightful analysis, and stories that matter
            </p>
            <div className="flex justify-center">
              <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Responsive Grid Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-4"
        >
          {/* Latest News - Full width on mobile, left column on desktop */}
          <motion.section variants={fadeUp} className="lg:col-span-1 order-1 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 border-b border-gray-200 pb-2 sm:pb-3">
                Latest News
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  ...categoryData.world.slice(0, 2),
                  ...categoryData.tech.slice(0, 2),
                  ...categoryData.business.slice(0, 2),
                ].slice(0, 6).map((article) => (
                  <article key={article.id} className="group">
                    <div className="border border-gray-100 rounded-lg p-3 hover:border-gray-300 transition-colors">
                      <h3 className="font-medium text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors text-xs sm:text-sm leading-tight">
                        <a href={`/article/${article.slug}`} className="line-clamp-2">
                          {article.title}
                        </a>
                      </h3>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Center Content - World & Tech Sections */}
          <motion.main variants={fadeUp} className="lg:col-span-2 order-3 lg:order-2">
            <div className="space-y-8 sm:space-y-12">
              {/* World Section */}
              <section>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">World</h2>
                  <a href="/world" className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm font-medium">
                    view all
                  </a>
                </div>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                  {categoryData.world.slice(0, 4).map((article) => (
                    <article key={article.id} className="group">
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Image placeholder */}
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs sm:text-sm">Image</span>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="font-medium text-gray-900 mb-1 sm:mb-2 group-hover:text-indigo-600 transition-colors text-xs sm:text-sm leading-tight">
                            <a href={`/article/${article.slug}`} className="line-clamp-2">
                              {article.title}
                            </a>
                          </h3>
                          <div className="text-xs text-gray-500 mb-1 sm:mb-2">
                            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                          </div>
                          {article.excerpt && (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {article.excerpt.substring(0, 60)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Tech Section */}
              <section>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tech</h2>
                  <a href="/tech" className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm font-medium">
                    view all
                  </a>
                </div>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                  {categoryData.tech.slice(0, 4).map((article) => (
                    <article key={article.id} className="group">
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Image placeholder */}
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs sm:text-sm">Image</span>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="font-medium text-gray-900 mb-1 sm:mb-2 group-hover:text-indigo-600 transition-colors text-xs sm:text-sm leading-tight">
                            <a href={`/article/${article.slug}`} className="line-clamp-2">
                              {article.title}
                            </a>
                          </h3>
                          <div className="text-xs text-gray-500 mb-1 sm:mb-2">
                            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                          </div>
                          {article.excerpt && (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {article.excerpt.substring(0, 60)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </motion.main>

          {/* Popular News - Full width on mobile, right column on desktop */}
          <motion.aside variants={fadeUp} className="lg:col-span-1 order-2 lg:order-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 border-b border-gray-200 pb-2 sm:pb-3">
                Popular News
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {transformedFeatured.slice(0, 6).map((article, index) => (
                  <article key={article.id} className="group">
                    <div className="flex gap-2 sm:gap-3 border border-gray-100 rounded-lg p-2 sm:p-3 hover:border-gray-300 transition-colors">
                      {/* Ranking number */}
                      <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      {/* Small image placeholder */}
                      <div className="w-12 sm:w-16 h-9 sm:h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Img</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors text-xs sm:text-sm leading-tight">
                          <a href={`/article/${article.slug}`} className="line-clamp-2">
                            {article.title}
                          </a>
                        </h3>
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </main>
  );
}
