// @/types/article.ts

export type ArticleStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  coverVideoUrl?: string;
  category: ArticleCategory;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleContentJson {
  time: number;
  blocks: Array<{
    id: string;
    type: string;
    data: Record<string, any>;
    tunes?: {
      highlight?: {
        highlighted: boolean;
      };
    };
  }>;
  version: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  contentJson: ArticleContentJson;
  status: ArticleStatus;
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
  metaTitle: string | null;
  metaDescription: string | null;
  authorName: string | null;
  author?: User;
  category: ArticleCategory;
  tags?: Tag[];
}

// Input types for mutations and queries
export interface ArticleFilters {
  status?: ArticleStatus;
  categorySlug?: string;
  topic?: string;
  authorId?: string;
  isFeatured?: boolean;
  isEditorsPick?: boolean;
  isBreaking?: boolean;
  take?: number;
  skip?: number;
  search?: string;
}

// Response types
export interface ArticlesResponse {
  articles: Article[];
  total?: number;
  hasMore?: boolean;
}

export interface CategoriesResponse {
  categories: ArticleCategory[];
}

export interface TopicsResponse {
  topics: Topic[];
}
