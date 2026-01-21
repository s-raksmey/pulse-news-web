// app/[category]/[topic]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getGqlClient } from "@/services/graphql-client";
import { Q_ARTICLE_BY_SLUG } from "@/services/article.gql";
import { isValidSection } from "@/config/editorial";
import ArticlePageClient from "@/components/article/article";

export const revalidate = 60;

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