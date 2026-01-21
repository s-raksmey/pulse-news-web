"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { getTranslations, type Locale } from "@/lib/i18n";

interface SearchResult {
  id: string;
  title: string;
  category: string;
  url: string;
  type: "article" | "category" | "author";
}

interface SearchBarProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// Mock search results - replace with actual search API
const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Breaking: Major Tech Company Announces New AI Initiative",
    category: "Technology",
    url: "/tech/latest/ai-initiative",
    type: "article",
  },
  {
    id: "2",
    title: "Global Climate Summit Reaches Historic Agreement",
    category: "World",
    url: "/world/latest/climate-summit",
    type: "article",
  },
  {
    id: "3",
    title: "Technology",
    category: "Category",
    url: "/tech",
    type: "category",
  },
];

const recentSearches = [
  "Climate change",
  "AI technology",
  "Election results",
  "Stock market",
];

const trendingSearches = [
  "Breaking news",
  "Tech innovation",
  "Global economy",
  "Sports updates",
];

export default function SearchBar({ locale, isOpen, onClose, className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = getTranslations(locale);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate API call
      const timer = setTimeout(() => {
        const filtered = mockSearchResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    window.location.href = result.url;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={`fixed left-1/2 top-20 z-50 w-full max-w-2xl -translate-x-1/2 rounded-xl bg-white shadow-2xl ${className}`}
          >
            {/* Search Input */}
            <form onSubmit={handleSubmit} className="border-b border-slate-200 p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.search.placeholder}
                  className="w-full rounded-lg border border-slate-200 py-4 pl-12 pr-12 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {query.length > 2 ? (
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    </div>
                  ) : results.length > 0 ? (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        {t.search.resultsTitle}
                      </h3>
                      {results.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className="w-full rounded-lg p-3 text-left transition-colors hover:bg-slate-50"
                        >
                          <div className="flex items-start gap-3">
                            <Search className="mt-1 h-4 w-4 text-slate-400" />
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{result.title}</p>
                              <p className="text-sm text-slate-500">{result.category}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-slate-500">
                        {t.search.noResults.replace("{query}", query)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Recent Searches */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        {t.search.recentTitle}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSuggestionClick(search)}
                          className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-200"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trending Searches */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-slate-400" />
                      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        {t.search.trendingTitle}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSuggestionClick(search)}
                          className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-100"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
