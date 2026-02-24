"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Share2, Copy, Facebook, Twitter, Send, Eye, Clock } from "lucide-react";
import { formatLongDate } from "@/lib/date";
import EditorRenderer from "@/components/renderer/editor-renderer";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { useEffect, useState } from "react";
import { useArticleViewTracking } from "@/hooks/useGraphQL";
import { Article } from "@/types/article";
import { format } from "date-fns";

/* =========================
   Motion
========================= */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

/* =========================
   Helpers
========================= */
function formatDate(value?: string | null) {
  return formatLongDate(value, "en") ?? "";
}

function titleCase(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

/* =========================
   Component
========================= */
export default function ArticlePageClient({
  article,
  category,
  topic,
}: {
  article: Article;
  category: string;
  topic: string;
}) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { trackView, viewTracked } = useArticleViewTracking();

  // Get current URL only on client side and track view
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
      // Track article view after component mounts
      trackView(article.slug);
    }
  }, [article.slug, trackView]);

  // Calculate reading time (rough estimate: 200 words per minute)
  const calculateReadingTime = (contentJson: any) => {
    if (!contentJson?.blocks) return 1;
    
    const wordCount = contentJson.blocks.reduce((count: number, block: any) => {
      if (block.type === 'paragraph' || block.type === 'header') {
        const text = block.data?.text || '';
        return count + text.split(/\s+/).length;
      }
      return count;
    }, 0);
    
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  const readingTime = calculateReadingTime(article.contentJson);

  const handleCopyLink = async () => {
    if (navigator.clipboard && currentUrl) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        // You could add a toast notification here
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const shareButtons = [
    {
      icon: Copy,
      onClick: handleCopyLink,
      title: "Copy link",
      className: "cursor-pointer"
    },
    {
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      title: "Share on Facebook",
      className: "text-blue-600"
    },
    {
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`,
      title: "Share on Twitter",
      className: "text-sky-500"
    },
    {
      icon: Send,
      href: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`,
      title: "Share on Telegram",
      className: "text-indigo-500"
    }
  ];

  return (
    <motion.article
      variants={stagger}
      initial="hidden"
      animate="show"
      className="relative mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16"
    >
      {/* ================= BREADCRUMB ================= */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: titleCase(category), href: `/${category}` },
          { label: topic, href: `/${category}/${topic}` },
          { label: article.title },
        ]}
      />

      {/* ================= HEADER ================= */}
      <motion.header variants={fadeUp} className="mb-8 space-y-5">
        {/* Title - Made smaller */}
        <h1 className="text-xl sm:text-2xl lg:text-[2rem] font-bold leading-snug tracking-tight" style={{ color: '#385CF5' }}>
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-base sm:text-lg text-slate-600 italic border-l-4 border-blue-600 pl-4">
            {article.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="font-medium text-slate-700">
            {article.authorName ?? "Pulse News"}
          </span>
          <span>•</span>
          <time>{formatDate(article.publishedAt)}</time>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{readingTime} min read</span>
          </div>
          {article.viewCount > 0 && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{article.viewCount.toLocaleString()} views</span>
              </div>
            </>
          )}
        </div>

        {/* Article badges */}
        {(article.isFeatured || article.isEditorsPick || article.isBreaking) && (
          <div className="flex gap-2">
            {article.isBreaking && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Breaking News
              </span>
            )}
            {article.isFeatured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Featured
              </span>
            )}
            {article.isEditorsPick && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Editor's Pick
              </span>
            )}
          </div>
        )}
      </motion.header>

      {/* ================= CONTENT ================= */}
      <motion.section
        variants={fadeUp}
        className="prose prose-slate prose-lg max-w-none"
      >
        {article.contentJson?.blocks?.length ? (
          <EditorRenderer data={article.contentJson} />
        ) : (
          <div className="text-center py-16 text-slate-500">
            No content available.
          </div>
        )}
      </motion.section>

      {/* ================= SHARE BAR ================= */}
      <motion.aside
        variants={fadeUp}
        className="sticky top-24 z-10 mt-8 flex items-center gap-3 bg-white/80 backdrop-blur border rounded-full px-4 py-2 w-fit shadow-sm"
      >
        <Share2 className="w-4 h-4 text-slate-500" />
        
        {shareButtons.map((button, index) => {
          if (button.onClick) {
            return (
              <button
                key={index}
                onClick={button.onClick}
                className={`p-2 rounded-full hover:bg-slate-100 ${button.className}`}
                title={button.title}
                disabled={!isMounted}
              >
                <button.icon className="w-4 h-4" />
              </button>
            );
          }
          
          // Only render external links when URL is available
          if (!isMounted || !currentUrl) {
            return (
              <button
                key={index}
                className={`p-2 rounded-full hover:bg-slate-100 ${button.className} opacity-50 cursor-not-allowed`}
                title={button.title}
                disabled
              >
                <button.icon className="w-4 h-4" />
              </button>
            );
          }
          
          return (
            <a
              key={index}
              href={button.href}
              target="_blank"
              rel="noreferrer"
              className={`p-2 rounded-full hover:bg-slate-100 ${button.className}`}
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </a>
          );
        })}
      </motion.aside>

      {/* ================= FOOTER ================= */}
      <motion.footer
        variants={fadeUp}
        className="mt-20 border-t pt-8 text-sm text-slate-500"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p>
              © {new Date().getFullYear()} <strong>Pulse News</strong>
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Last updated: {formatDate(article.updatedAt)}
          </div>
        </div>
      </motion.footer>
    </motion.article>
  );
}
