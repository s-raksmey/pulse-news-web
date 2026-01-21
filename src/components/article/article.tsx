"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Share2, Copy, Facebook, Twitter, Send } from "lucide-react";
import { formatLongDate } from "@/lib/date";
import EditorRenderer from "@/components/renderer/editor-renderer";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { useEffect, useState } from "react";

/* =========================
   Types
========================= */
interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

interface ArticleContentJson {
  time: number;
  blocks: Array<{
    id: string;
    type: string;
    data: Record<string, any>;
  }>;
  version: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  contentJson: ArticleContentJson;
  excerpt: string | null;
  publishedAt: string;
  updatedAt: string;
  authorName: string | null;
  category: ArticleCategory;
  topic: string;
}

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

  // Get current URL only on client side
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

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
          { label: titleCase(topic), href: `/${category}/${topic}` },
          { label: article.title },
        ]}
      />

      {/* ================= HEADER ================= */}
      <motion.header variants={fadeUp} className="mb-8 space-y-5">
        {/* Title - Made smaller */}
        <h1 className="text-xl sm:text-2xl lg:text-[2rem] font-bold leading-snug tracking-tight text-slate-900">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-base sm:text-lg text-slate-600 italic border-l-4 border-blue-600 pl-4">
            {article.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-medium text-slate-700">
            {article.authorName ?? "Pulse News"}
          </span>
          <span>•</span>
          <time>{formatDate(article.publishedAt)}</time>
        </div>
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
