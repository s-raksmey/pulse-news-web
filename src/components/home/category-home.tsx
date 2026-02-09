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
      {/* Clean Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Pulse News
            </h1>
            <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Your source for the latest news and insights from around the world
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-16"
        >
          {/* Featured Stories */}
          {transformedFeatured.length > 0 && (
            <motion.section variants={fadeUp}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Featured Stories
                </h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {transformedFeatured.slice(0, 6).map((article, index) => (
                  <article key={article.id} className="group cursor-pointer">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
                      <div className="flex items-start gap-3 mb-4">
                        <span className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {article.category && (
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wide">
                            {article.category.name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                        <a href={`/article/${article.slug}`}>
                          {article.title}
                        </a>
                      </h3>
                      {article.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>
          )}

          {/* Latest News */}
          <motion.section variants={fadeUp}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Latest News
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                ...categoryData.world.slice(0, 3),
                ...categoryData.tech.slice(0, 3),
                ...categoryData.business.slice(0, 3),
              ].slice(0, 9).map((article) => (
                <article key={article.id} className="group">
                  <div className="bg-white rounded-lg p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      {article.category && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wide">
                          {article.category.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      <a href={`/article/${article.slug}`}>
                        {article.title}
                      </a>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}
