// app/[category]/page.tsx (Server Component)
import { notFound } from "next/navigation";
import CategoryClient from "@/components/category/category";
import { getGqlClient } from "@/services/graphql-client";
import { Q_LATEST_BY_CATEGORY } from "@/services/article.gql";
import { isValidSection } from "@/config/editorial";

export const revalidate = 60;

function extractFirstParagraph(contentJson: any): string | null {
  if (!contentJson) return null;
  
  let parsed = contentJson;
  if (typeof contentJson === 'string') {
    try {
      parsed = JSON.parse(contentJson);
    } catch {
      return null;
    }
  }
  
  if (!parsed.blocks || !Array.isArray(parsed.blocks)) return null;
  
  const paragraphBlock = parsed.blocks.find((block: any) => block.type === 'paragraph');
  
  if (paragraphBlock?.data?.text) {
    const text = paragraphBlock.data.text.replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }
  
  return null;
}

function extractFirstMedia(contentJson: any): {
  type: 'image' | 'video' | null;
  url: string | null;
  caption?: string;
} {
  if (!contentJson) return { type: null, url: null };
  
  let parsed = contentJson;
  if (typeof contentJson === 'string') {
    try {
      parsed = JSON.parse(contentJson);
    } catch {
      return { type: null, url: null };
    }
  }
  
  if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
    return { type: null, url: null };
  }
  
  const mediaBlock = parsed.blocks.find((block: any) => 
    block.type === 'image' || block.type === 'video'
  );
  
  if (!mediaBlock) return { type: null, url: null };
  
  if (mediaBlock.type === 'image') {
    const imageUrl = mediaBlock.data?.url || 
                     mediaBlock.data?.file?.url || 
                     mediaBlock.data?.src;
    
    if (imageUrl) {
      return {
        type: 'image',
        url: imageUrl,
        caption: mediaBlock.data?.caption || mediaBlock.data?.alt || ''
      };
    }
  }
  
  if (mediaBlock.type === 'video') {
    const videoUrl = mediaBlock.data?.embed || 
                     mediaBlock.data?.url || 
                     mediaBlock.data?.source ||
                     mediaBlock.data?.file?.url;
    
    if (videoUrl) {
      return {
        type: 'video',
        url: videoUrl,
        caption: mediaBlock.data?.caption || ''
      };
    }
  }
  
  return { type: null, url: null };
}

function getArticleMedia(article: any): {
  type: 'image' | 'video' | null;
  url: string | null;
  caption?: string;
} {
  const mediaFromContent = extractFirstMedia(article.contentJson);
  if (mediaFromContent.url) return mediaFromContent;
  
  if (article.featuredImageUrl || article.coverImageUrl) {
    return {
      type: 'image',
      url: article.featuredImageUrl || article.coverImageUrl,
      caption: article.title
    };
  }
  
  return { type: null, url: null };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isValidSection(category)) notFound();

  const client = getGqlClient();
  const articlesResponse = await client.request(Q_LATEST_BY_CATEGORY, {
    categorySlug: category,
    limit: 20,
  });
  const articles = articlesResponse?.latestByCategory ?? [];

  // Transform articles with extracted media and paragraphs
  const articlesWithMedia = articles.map((article: any) => {
    const media = getArticleMedia(article);
    const paragraph = extractFirstParagraph(article.contentJson);
    
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      topic: article.topic,
      publishedAt: article.publishedAt,
      authorName: article.authorName,
      category: article.category,
      // Add extracted data
      media: media.url ? media : null,
      firstParagraph: paragraph,
      contentJson: article.contentJson,
    };
  }) || [];

  return (
    <CategoryClient
      category={category}
      articles={articlesWithMedia}
    />
  );
}
