// app/[category]/[topic]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getGqlClient } from "@/services/graphql-client";
import { Q_ARTICLE_BY_SLUG } from "@/services/article.gql";
import { isValidSection } from "@/config/editorial";
import ArticlePageClient from "@/components/article/article";

export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{
    category: string;
    topic: string;
    slug: string;
  }>;
}): Promise<Metadata> {
  const { category, topic, slug } = await params;
  
  try {
    const client = getGqlClient();
    const result = await client.request(Q_ARTICLE_BY_SLUG, { slug });
    const article = result.article || result.articleBySlug;

    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
      };
    }

    const title = article.seoTitle || article.title;
    const description = article.seoDescription || article.excerpt || `Read ${article.title} on Pulse News`;
    const publishedTime = article.publishedAt;
    const modifiedTime = article.updatedAt;
    const author = article.authorName || 'Pulse News';
    const imageUrl = article.ogImageUrl || article.coverImageUrl;
    const url = `https://pulse-news.com/${category}/${topic}/${slug}`;

    return {
      title,
      description,
      authors: [{ name: author }],
      openGraph: {
        title,
        description,
        url,
        siteName: 'Pulse News',
        type: 'article',
        publishedTime,
        modifiedTime,
        authors: [author],
        section: article.category?.name,
        tags: article.tags?.map(tag => tag.name) || [],
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
        creator: '@pulsenews',
      },
      alternates: {
        canonical: url,
      },
      other: {
        'article:published_time': publishedTime,
        'article:modified_time': modifiedTime,
        'article:author': author,
        'article:section': article.category?.name || category,
        'article:tag': article.tags?.map(tag => tag.name).join(',') || '',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Pulse News',
      description: 'Stay informed with the latest news and updates.',
    };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{
    category: string;
    topic: string;
    slug: string;
  }>;
}) {
  const { category, topic, slug } = await params;

  // ✅ validate section only
  if (!isValidSection(category)) notFound();

  const client = getGqlClient();
  
  try {
    const result = await client.request(Q_ARTICLE_BY_SLUG, { slug });
    
    // Check the field name - might be 'article' not 'articleBySlug'
    const article = result.article || result.articleBySlug;
    
    if (!article) notFound();
    if (article.category?.slug !== category) notFound();
    if (article.topic !== topic) notFound();

    return (
      <ArticlePageClient
        article={article}
        category={category}
        topic={topic}
      />
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    notFound();
  }
}
