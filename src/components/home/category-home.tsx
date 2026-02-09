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
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-7xl font-black text-white mb-8 tracking-tight">
              PULSE
            </h1>
            <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
              Breaking news, insightful analysis, and stories that matter
            </p>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-20"
        >
          {/* Top Stories */}
          {transformedFeatured.length > 0 && (
            <motion.section variants={fadeUp}>
              <div className="mb-16">
                <h2 className="text-5xl font-bold text-gray-900 mb-6">
                  Top Stories
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
              
              {/* Main Featured Article */}
              {transformedFeatured[0] && (
                <div className="mb-16">
                  <article className="group cursor-pointer">
                    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                          Featured
                        </span>
                        {transformedFeatured[0].category && (
                          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">
                            {transformedFeatured[0].category.name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-4xl font-bold text-gray-900 mb-6 group-hover:text-indigo-600 transition-colors leading-tight">
                        <a href={`/article/${transformedFeatured[0].slug}`}>
                          {transformedFeatured[0].title}
                        </a>
                      </h3>
                      {transformedFeatured[0].excerpt && (
                        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                          {transformedFeatured[0].excerpt}
                        </p>
                      )}
                      <div className="text-sm text-gray-500 font-medium">
                        {formatDistanceToNow(new Date(transformedFeatured[0].publishedAt), { addSuffix: true })}
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* Secondary Featured Articles */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {transformedFeatured.slice(1, 7).map((article, index) => (
                  <article key={article.id} className="group cursor-pointer">
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 2}
                        </span>
                        {article.category && (
                          <span className="text-indigo-600 font-semibold text-xs uppercase tracking-wide">
                            {article.category.name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                        <a href={`/article/${article.slug}`}>
                          {article.title}
                        </a>
                      </h3>
                      <div className="text-sm text-gray-500 font-medium">
                        {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>
          )}

          {/* Recent Updates */}
          <motion.section variants={fadeUp}>
            <div className="mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Recent Updates
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                ...categoryData.world.slice(0, 4),
                ...categoryData.tech.slice(0, 4),
                ...categoryData.business.slice(0, 4),
              ].slice(0, 12).map((article) => (
                <article key={article.id} className="group">
                  <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full">
                    <div className="flex items-center gap-2 mb-3">
                      {article.category && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                          {article.category.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                      <a href={`/article/${article.slug}`}>
                        {article.title}
                      </a>
                    </h3>
                    <div className="text-xs text-gray-500 font-medium">
                      {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                    </div>
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
