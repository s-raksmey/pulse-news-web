"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Article } from "@/types/article";
import { getTranslations, type Locale } from "@/lib/i18n";
import { HomePageSkeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
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
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      {transformedFeatured.length > 0 && (
        <HeroSection locale={locale} featuredArticles={transformedFeatured.slice(0, 5)} />
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Category Sections */}
          <div className="lg:col-span-8">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Page Title */}
              <motion.div variants={fadeUp} className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  Latest News by Category
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Stay informed with the latest updates from around the world, organized by topic
                </p>
              </motion.div>

              {/* Category Sections */}
              {categories.map((category) => {
                const articles = categoryData[category.key as keyof typeof categoryData] || [];
                return (
                  <CategorySection
                    key={category.key}
                    title={category.title}
                    slug={category.slug}
                    articles={articles}
                    locale={locale}
                  />
                );
              })}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <Sidebar
                locale={locale}
                trendingArticles={transformedTrending}
                showNewsletter={true}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
