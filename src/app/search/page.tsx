'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useArticleSearch } from '@/hooks/useGraphQL';
import { Article } from '@/hooks/useGraphQL';
import { motion } from 'framer-motion';
import { Search, Filter, X, Calendar, User, Tag, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations, type Locale } from '@/lib/i18n';

interface SearchPageContentProps {
  locale: Locale;
}

function SearchPageContent({ locale }: SearchPageContentProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const t = getTranslations(locale);
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    categorySlug: '',
    sortBy: 'relevance',
    sortOrder: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { searchArticles, loading, error } = useArticleSearch();

  const performSearch = useCallback(async (query: string, page = 0, resetResults = true) => {
    if (!query.trim()) {
      setResults([]);
      setTotalCount(0);
      setHasMore(false);
      return;
    }

    try {
      const searchInput = {
        query: query.trim(),
        categorySlug: filters.categorySlug || undefined,
        sortBy: filters.sortBy || 'relevance',
        sortOrder: filters.sortOrder || 'desc',
        take: 12,
        skip: page * 12,
        status: 'PUBLISHED', // Only show published articles on public site
      };

      const response = await searchArticles(searchInput);

      if (response?.searchArticles) {
        const newResults = response.searchArticles.articles || [];
        setResults(resetResults ? newResults : [...results, ...newResults]);
        setTotalCount(response.searchArticles.totalCount || 0);
        setHasMore(response.searchArticles.hasMore || false);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  }, [searchArticles, filters, results]);

  // Perform search when component mounts or query changes
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  // Perform search when query or filters change
  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(0);
      performSearch(searchQuery, 0, true);
    }
  }, [searchQuery, filters]);

  const loadMore = () => {
    performSearch(searchQuery, currentPage + 1, false);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      categorySlug: '',
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {t.search?.resultsTitle || 'Search Results'}
          </h1>
          
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder={t.search?.placeholder || "Search articles, categories, authors..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-4 pl-12 pr-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            {filters.categorySlug && (
              <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                <Tag className="h-3 w-3" />
                Category: {filters.categorySlug}
                <button
                  onClick={() => handleFilterChange('categorySlug', '')}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {(filters.categorySlug) && (
              <button
                onClick={clearFilters}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.categorySlug}
                    onChange={(e) => handleFilterChange('categorySlug', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="tech">Technology</option>
                    <option value="world">World</option>
                    <option value="business">Business</option>
                    <option value="sports">Sports</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date</option>
                    <option value="views">Views</option>
                    <option value="title">Title</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Order
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Summary */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-slate-600">
              {loading ? 'Searching...' : `${totalCount} results for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && results.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto mb-4" />
              <p className="text-slate-600">Searching articles...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
            <p className="text-red-800">
              Something went wrong while searching. Please try again.
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`/${article.category.slug}/${article.slug}`}>
                    {/* Cover Image */}
                    {article.coverImageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.coverImageUrl}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {article.isBreaking && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              BREAKING
                            </span>
                          </div>
                        )}
                        {article.isFeatured && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              FEATURED
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Category */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                          {article.category.name}
                        </span>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.authorName || 'Pulse News'}
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{article.viewCount} views</span>
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center pt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Loading...' : 'Load More Articles'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && searchQuery && results.length === 0 && !error && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Empty State */}
        {!searchQuery && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">Start searching</h3>
            <p className="text-slate-600">
              Enter a search term to find articles, content, and more
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  // Get locale from URL or default to 'en'
  const locale: Locale = 'en'; // You might want to get this from context or URL

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent locale={locale} />
    </Suspense>
  );
}
