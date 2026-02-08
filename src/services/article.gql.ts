/* =========================
   Categories
========================= */

export const Q_CATEGORIES = /* GraphQL */ `
  query Categories {
    categories {
      id
      name
      slug
    }
  }
`;

/* =========================
   Articles list
========================= */

export const Q_ARTICLES = /* GraphQL */ `
  query Articles(
    $status: ArticleStatus
    $categorySlug: String
    $topic: String
    $take: Int
    $skip: Int
  ) {
    articles(
      status: $status
      categorySlug: $categorySlug
      topic: $topic
      take: $take
      skip: $skip
    ) {
      id
      title
      slug
      excerpt
      status
      topic
      publishedAt
      viewCount
      isFeatured
      isEditorsPick
      isBreaking
      coverImageUrl
      ogImageUrl
      contentJson 
      category {
        name
        slug
      }
    }
  }
`;

/* =========================
   Article by slug (public)
========================= */

export const Q_ARTICLES_BY_TOPIC = /* GraphQL */ `
  query ArticlesByTopic($categorySlug: String!, $topicSlug: String!) {
    articlesByTopic(categorySlug: $categorySlug, topicSlug: $topicSlug) {
      id
      title
      slug
      excerpt
      topic
      status
      isBreaking
      authorName
      publishedAt
      createdAt
      updatedAt
      contentJson
      category {
        name
        slug
      }
    }
  }
`;

/* =========================
   Article by ID (CMS)
========================= */

export const Q_ARTICLE_BY_ID = /* GraphQL */ `
  query ArticleById($id: ID!) {
    articleById(id: $id) {
      id
      title
      slug
      excerpt
      topic
      status
      isBreaking
      authorName
      publishedAt
      createdAt
      updatedAt
      category {
        name
        slug
      }
      contentJson
    }
  }
`;

export const Q_ARTICLE_BY_SLUG = /* GraphQL */ `
  query ArticleBySlug($slug: String!) {
    articleBySlug(slug: $slug) {
      id
      title
      slug
      excerpt
      topic
      status
      authorName
      publishedAt
      createdAt
      updatedAt
      viewCount
      isFeatured
      isEditorsPick
      isBreaking
      coverImageUrl
      ogImageUrl
      seoTitle
      seoDescription
      category {
        id
        name
        slug
      }
      contentJson
    }
  }
`;

/* =========================
   Mutations
========================= */

export const M_UPSERT_ARTICLE = /* GraphQL */ `
  mutation UpsertArticle($id: ID, $input: UpsertArticleInput!) {
    upsertArticle(id: $id, input: $input) {
      id
      title
      slug
      excerpt
      topic
      status
      publishedAt
      isBreaking
      category {
        id
        name
        slug
      }
      contentJson
    }
  }
`;

export const M_SET_STATUS = /* GraphQL */ `
  mutation SetArticleStatus($id: ID!, $status: ArticleStatus!) {
    setArticleStatus(id: $id, status: $status) {
      id
      status
      publishedAt
    }
  }
`;

export const M_DELETE_ARTICLE = /* GraphQL */ `
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id)
  }
`;

/* =========================
   Home sections (UPDATED)
========================= */

export const Q_TOP_STORIES = /* GraphQL */ `
  query {
    topStories {
      id
      title
      slug
      excerpt
      topic
      contentJson
      publishedAt
      category { name slug }
    }
  }
`;

export const Q_EDITORS_PICKS = /* GraphQL */ `
  query {
    editorsPicks {
      id
      title
      slug
      excerpt
      topic
      contentJson
      category { name slug }
    }
  }
`;

export const Q_BREAKING_NEWS = /* GraphQL */ `
  query {
    breakingNews {
      id
      title
      slug
      excerpt
      topic
      contentJson
      publishedAt
      category { name slug }
    }
  }
`;

export const Q_TRENDING = /* GraphQL */ `
  query {
    trending {
      id
      title
      slug
      topic
      contentJson
      publishedAt
      category { name slug }
    }
  }
`;

/* =========================
   Fallback queries for homepage
========================= */

export const Q_RECENT_ARTICLES = /* GraphQL */ `
  query RecentArticles($take: Int = 6) {
    articles(status: PUBLISHED, take: $take, skip: 0) {
      id
      title
      slug
      excerpt
      topic
      contentJson
      publishedAt
      viewCount
      isFeatured
      isEditorsPick
      isBreaking
      coverImageUrl
      ogImageUrl
      category { name slug }
    }
  }
`;

export const M_INCREMENT_VIEW = /* GraphQL */ `
  mutation ($slug: String!) {
    incrementArticleView(slug: $slug)
  }
`;

export const Q_TOPIC_BY_SLUG = /* GraphQL */ `
  query TopicBySlug($categorySlug: String!, $topicSlug: String!) {
    topicBySlug(categorySlug: $categorySlug, topicSlug: $topicSlug) {
      id
      slug
      title
      description
      coverImageUrl
      coverVideoUrl
      category {
        name
        slug
      }
    }
  }
`;

/* =========================
   Public queries for web frontend
========================= */

export const Q_LATEST_BY_CATEGORY = /* GraphQL */ `
  query LatestByCategory($categorySlug: String!, $limit: Int = 20) {
    latestByCategory(categorySlug: $categorySlug, limit: $limit) {
      id
      title
      slug
      excerpt
      topic
      publishedAt
      viewCount
      isFeatured
      isEditorsPick
      isBreaking
      coverImageUrl
      ogImageUrl
      contentJson 
      category {
        name
        slug
      }
    }
  }
`;

/* =========================
   Home Page Category Queries
========================= */

export const Q_HOME_PAGE_CATEGORIES = /* GraphQL */ `
  query HomePageCategories {
    world: latestByCategory(categorySlug: "world", limit: 4) {
      id
      title
      slug
      excerpt
      topic
      publishedAt
      viewCount
      coverImageUrl
      category {
        name
        slug
      }
    }
    tech: latestByCategory(categorySlug: "tech", limit: 4) {
      id
      title
      slug
      excerpt
      topic
      publishedAt
      viewCount
      coverImageUrl
      category {
        name
        slug
      }
    }
    business: latestByCategory(categorySlug: "business", limit: 4) {
      id
      title
      slug
      excerpt
      topic
      publishedAt
      viewCount
      coverImageUrl
      category {
        name
        slug
      }
    }
    politics: latestByCategory(categorySlug: "politics", limit: 4) {
      id
      title
      slug
      excerpt
      topic
      publishedAt
      viewCount
      coverImageUrl
      category {
        name
        slug
      }
    }
    sports: latestByCategory(categorySlug: "sports", limit: 4) {
      id
      title
      slug
      excerpt
      topic
      publishedAt
      viewCount
      coverImageUrl
      category {
        name
        slug
      }
    }
    culture: latestByCategory(categorySlug: "culture", limit: 4) {
      id
      title
      slug
      excerpt
      topic
      publishedAt
      viewCount
      coverImageUrl
      category {
        name
        slug
      }
    }
  }
`;

export const Q_FEATURED_ARTICLES = /* GraphQL */ `
  query FeaturedArticles($limit: Int = 5) {
    articles(status: PUBLISHED, take: $limit, skip: 0) {
      id
      title
      slug
      excerpt
      topic
      publishedAt
      viewCount
      isFeatured
      isEditorsPick
      isBreaking
      coverImageUrl
      ogImageUrl
      category {
        name
        slug
      }
    }
  }
`;
