"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface BreakingNewsItem {
  id: string;
  title: string;
  url: string;
  timestamp: string;
}

interface BreakingNewsBannerProps {
  breakingNews?: BreakingNewsItem[];
}

export default function BreakingNewsBanner({ breakingNews = [] }: BreakingNewsBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate breaking news items
  useEffect(() => {
    if (breakingNews.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNews.length, isPaused]);

  if (!isVisible || breakingNews.length === 0) return null;

  const currentNews = breakingNews[currentIndex];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="relative bg-red-600 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wide">
                Breaking News
              </span>
            </div>
            
            <div className="hidden h-4 w-px bg-red-400 sm:block" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNews?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <Link
                  href={currentNews?.url || "#"}
                  className="block text-sm hover:underline sm:text-base"
                >
                  <span className="line-clamp-1">{currentNews?.title}</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            {/* Pagination dots */}
            {breakingNews.length > 1 && (
              <div className="hidden items-center gap-1 sm:flex">
                {breakingNews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      index === currentIndex ? "bg-white" : "bg-red-400"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="rounded p-1 hover:bg-red-700"
              aria-label="Close breaking news"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
