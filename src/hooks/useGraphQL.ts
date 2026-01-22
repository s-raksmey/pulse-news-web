// src/hooks/useGraphQL.ts
import { useState, useCallback } from 'react';
import { getGqlClient } from '@/services/graphql-client';
import { 
  Q_ARTICLES, 
  Q_ARTICLE_BY_SLUG, 
  Q_CATEGORIES,
  Q_ARTICLES_BY_TOPIC,
  Q_TOPIC_BY_SLUG,
  M_INCREMENT_VIEW
} from '@/services/article.gql';

// Enhanced types for web frontend
export interface ArticleStatus {
  DRAFT: 'DRAFT';
  REVIEW: 'REVIEW'; 
  PUBLISHED: 'PUBLISHED';
  ARCHIVED: 'ARCHIVED';
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: keyof ArticleStatus;
  topic: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isFeatured: boolean;
  isEditorsPick: boolean;
  isBreaking: boolean;
  coverImageUrl: string | null;
  ogImageUrl: string | null;
  contentJson: any;
  category: ArticleCategory;
  authorName: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface ArticleFilters {
  status?: keyof ArticleStatus;
  categorySlug?: string;
  topic?: string;
  take?: number;
  skip?: number;
}

// Base GraphQL hook with error handling
export function useGraphQL() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = useCallback(async <T>(
    query: string, 
    variables?: Record<string, any>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const client = getGqlClient();
      const result = await client.request<T>(query, variables);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('GraphQL Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { executeQuery, loading, error };
}

// Hook for fetching articles with filtering
export function useArticles() {
  const { executeQuery, loading, error } = useGraphQL();

  const getArticles = useCallback(async (filters: ArticleFilters = {}) => {
    return executeQuery<{ articles: Article[] }>(Q_ARTICLES, filters);
  }, [executeQuery]);

  const getArticleBySlug = useCallback(async (slug: string) => {
    return executeQuery<{ article: Article }>(Q_ARTICLE_BY_SLUG, { slug });
  }, [executeQuery]);

  const getArticlesByTopic = useCallback(async (categorySlug: string, topicSlug: string) => {
    return executeQuery<{ articlesByTopic: Article[] }>(Q_ARTICLES_BY_TOPIC, {
      categorySlug,
      topicSlug
    });
  }, [executeQuery]);

  return {
    getArticles,
    getArticleBySlug,
    getArticlesByTopic,
    loading,
    error
  };
}

// Hook for categories
export function useCategories() {
  const { executeQuery, loading, error } = useGraphQL();

  const getCategories = useCallback(async () => {
    return executeQuery<{ categories: ArticleCategory[] }>(Q_CATEGORIES);
  }, [executeQuery]);

  return {
    getCategories,
    loading,
    error
  };
}

// Hook for topics
export function useTopics() {
  const { executeQuery, loading, error } = useGraphQL();

  const getTopicBySlug = useCallback(async (categorySlug: string, topicSlug: string) => {
    return executeQuery<{ topicBySlug: any }>(Q_TOPIC_BY_SLUG, {
      categorySlug,
      topicSlug
    });
  }, [executeQuery]);

  return {
    getTopicBySlug,
    loading,
    error
  };
}

// Hook for article interactions (view tracking, etc.)
export function useArticleInteractions() {
  const { executeQuery, loading, error } = useGraphQL();

  const incrementView = useCallback(async (slug: string) => {
    return executeQuery<{ incrementArticleView: boolean }>(M_INCREMENT_VIEW, { slug });
  }, [executeQuery]);

  return {
    incrementView,
    loading,
    error
  };
}

// Hook for client-side article view tracking with debouncing
export function useArticleViewTracking() {
  const { incrementView } = useArticleInteractions();
  const [viewTracked, setViewTracked] = useState(false);

  const trackView = useCallback(async (slug: string) => {
    if (viewTracked) return; // Prevent multiple tracking
    
    // Track view after a short delay to ensure user is actually reading
    setTimeout(async () => {
      await incrementView(slug);
      setViewTracked(true);
    }, 3000); // 3 second delay
  }, [incrementView, viewTracked]);

  return { trackView, viewTracked };
}

// Hook for search functionality (when implemented)
export function useArticleSearch() {
  const { executeQuery, loading, error } = useGraphQL();

  const searchArticles = useCallback(async (query: string, filters: ArticleFilters = {}) => {
    // This would need a search query to be implemented in the backend
    // For now, we'll use the regular articles query with filters
    return executeQuery<{ articles: Article[] }>(Q_ARTICLES, {
      ...filters,
      // search: query // This would be added when backend supports search
    });
  }, [executeQuery]);

  return {
    searchArticles,
    loading,
    error
  };
}
