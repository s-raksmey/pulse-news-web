// app/[category]/[topic]/page.tsx
import { notFound } from "next/navigation";
import TopicClient from "@/components/topic/topic";
import { getGqlClient } from "@/services/graphql-client";
import { Q_ARTICLES_BY_TOPIC, Q_TOPIC_BY_SLUG, Q_LATEST_BY_CATEGORY, Q_CATEGORIES } from "@/services/article.gql";

export const revalidate = 60;

export default async function TopicPage({
  params,
}: {
  params: Promise<{ category: string; topic: string }>;
}) {
  const { category, topic } = await params;
  
  const client = getGqlClient();
  
  // Validate category exists in database
  const categoriesResponse = await client.request(Q_CATEGORIES);
  const categories = categoriesResponse?.categories ?? [];
  
  const categoryExists = categories.some((cat: any) => cat.slug === category);
  if (!categoryExists) {
    notFound();
  }

  try {
    const isLatest = topic === "latest";

    const [topicResponse, articlesResponse] = await Promise.all([
      isLatest
        ? Promise.resolve(null)
        : client.request(Q_TOPIC_BY_SLUG, {
            categorySlug: category,
            topicSlug: topic,
          }),
      isLatest
        ? client.request(Q_LATEST_BY_CATEGORY, {
            categorySlug: category,
            limit: 20,
          })
        : client.request(Q_ARTICLES_BY_TOPIC, {
            categorySlug: category,
            topicSlug: topic,
          }),
    ]);

    const topicBySlug = isLatest
      ? null
      : (topicResponse as { topicBySlug?: any } | null)?.topicBySlug ?? null;
    const articles = isLatest
      ? (articlesResponse as { latestByCategory?: any[] } | null)?.latestByCategory ?? []
      : (articlesResponse as { articlesByTopic?: any[] } | null)?.articlesByTopic ?? [];

    // Prepare data for client component
    const topicMeta = topicBySlug ? {
      title: topicBySlug.title,
      description: topicBySlug.description,
      category: {
        name: topicBySlug.category?.name || category,
        slug: category,
      }
    } : null;

    // Transform articles to match client component type
    const articlesData = articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      topic: article.topic,
      publishedAt: article.publishedAt,
      authorName: article.authorName,
      contentJson: article.contentJson,
    }));

    return (
      <TopicClient
        category={category}
        topic={topic}
        topicMeta={topicMeta}
        articles={articlesData}
      />
    );
  } catch (error) {
    console.error("Error loading topic page:", error);
    notFound();
  }
}
