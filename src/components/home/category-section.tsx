"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Clock, Eye } from "lucide-react";
import { Article } from "@/types/article";
import { getTranslations, type Locale } from "@/lib/i18n";
import { formatDistanceToNow } from "date-fns";

interface CategorySectionProps {
  title: string;
  slug: string;
  articles: Article[];
  locale: Locale;
  icon?: string;
  color?: string;
}

const categoryIcons: Record<string, string> = {
  world: "🌍",
  tech: "💻", 
  business: "💼",
  politics: "🏛️",
  sports: "⚽",
  culture: "🎨"
};

const categoryColors: Record<string, string> = {
  world: "from-blue-500 to-blue-600",
  tech: "from-purple-500 to-purple-600",
  business: "from-green-500 to-green-600", 
  politics: "from-red-500 to-red-600",
  sports: "from-orange-500 to-orange-600",
  culture: "from-pink-500 to-pink-600"
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function CategorySection({ 
  title, 
  slug, 
  articles, 
  locale,
  icon,
  color 
}: CategorySectionProps) {
  const t = getTranslations(locale);
  const categoryIcon = icon || categoryIcons[slug] || "📰";
  const categoryColor = color || categoryColors[slug] || "from-gray-500 to-gray-600";

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="mb-12"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${categoryColor} flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
            {categoryIcon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">
              {title}
            </h2>
            <p className="text-sm text-slate-600">
              Latest {title.toLowerCase()} news and updates
            </p>
          </div>
        </div>
        
        <Link 
          href={`/${slug}`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors group"
        >
          View All
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Articles Grid */}
      <motion.div 
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {articles.map((article, index) => (
          <motion.article
            key={article.id}
            variants={fadeUp}
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 hover:border-slate-300"
          >
            <Link href={`/${article.category?.slug || slug}/${article.topic || 'latest'}/${article.slug}`}>
              {/* Article Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {article.coverImageUrl ? (
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center`}>
                    <span className="text-4xl text-white opacity-80">
                      {categoryIcon}
                    </span>
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs font-medium text-white bg-gradient-to-r ${categoryColor} rounded-full shadow-lg`}>
                    {article.category?.name || title}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h3>
                
                {article.excerpt && (
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                )}

                {/* Article Meta */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    {article.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                    
                    {article.viewCount && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{article.viewCount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </motion.div>

      {/* Show More Button for Mobile */}
      <div className="mt-6 text-center lg:hidden">
        <Link 
          href={`/${slug}`}
          className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r ${categoryColor} rounded-lg hover:shadow-lg transition-all`}
        >
          View All {title} News
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.section>
  );
}
