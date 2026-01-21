// app/[category]/[topic]/page.tsx
import { notFound } from "next/navigation";
import TopicClient from "@/components/topic/topic";
import { getGqlClient } from "@/services/graphql-client";
import { Q_ARTICLES, Q_TOPIC_BY_SLUG } from "@/services/article.gql";
import { isValidSection } from "@/config/editorial";

export const revalidate = 60;

export default async function TopicPage({
  params,
}: {
  params: Promise<{ category: string; topic: string }>;
}) {
  const { category, topic } = await params;
  if (!isValidSection(category)) notFound();

  const client = getGqlClient();

  try {
    const [{ topicBySlug }, { articles }] = await Promise.all([
      client.request(Q_TOPIC_BY_SLUG, {
        categorySlug: category,
        topicSlug: topic,
      }),
      client.request(Q_ARTICLES, {
        status: "PUBLISHED",
        categorySlug: category,
        topic: topic === "latest" ? undefined : topic,
        take: 20,
        skip: 0,
      }),
    ]);

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
    const articlesData = articles?.map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      topic: article.topic,
      publishedAt: article.publishedAt,
      authorName: article.authorName,
      contentJson: article.contentJson,
    })) || [];

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