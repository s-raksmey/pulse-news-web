// app/(public)/page.tsx
import { cookies } from "next/headers";
import { getGqlClient } from "@/services/graphql-client";
import {
  Q_TOP_STORIES,
  Q_EDITORS_PICKS,
  Q_TRENDING,
  Q_RECENT_ARTICLES,
} from "@/services/article.gql";
import HomePageClient from "@/components/home/home";

export const revalidate = 60;

export default async function HomePage() {
  const client = getGqlClient();
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get("locale")?.value;
  const locale = requestedLocale === "km" ? "km" : "en";

  try {
    // First, try to fetch the main queries
    const [top, picks, trending] = await Promise.all([
      client.request(Q_TOP_STORIES).catch((error) => {
        console.warn("Failed to fetch top stories:", error);
        return { topStories: [] };
      }),
      client.request(Q_EDITORS_PICKS).catch((error) => {
        console.warn("Failed to fetch editor's picks:", error);
        return { editorsPicks: [] };
      }),
      client.request(Q_TRENDING).catch((error) => {
        console.warn("Failed to fetch trending:", error);
        return { trending: [] };
      }),
    ]);

    // Check if we got empty results and need fallbacks
    const topStories = top?.topStories ?? [];
    const editorsPicks = picks?.editorsPicks ?? [];
    const trendingArticles = trending?.trending ?? [];

    // If all main queries returned empty, try fallback with recent articles
    if (topStories.length === 0 && editorsPicks.length === 0 && trendingArticles.length === 0) {
      console.warn("All main queries returned empty, trying fallback with recent articles");
      try {
        const recentResult = await client.request(Q_RECENT_ARTICLES, { take: 6 });
        const recentArticles = recentResult?.articles ?? [];
        
        if (recentArticles.length > 0) {
          console.log(`Found ${recentArticles.length} recent articles as fallback`);
          // Use recent articles for all sections as fallback
          return (
            <HomePageClient
              locale={locale}
              topStories={recentArticles.slice(0, 3)}
              editorsPicks={recentArticles.slice(0, 3)}
              trending={recentArticles}
            />
          );
        }
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
      }
    }

    return (
      <HomePageClient
        locale={locale}
        topStories={topStories}
        editorsPicks={editorsPicks}
        trending={trendingArticles}
      />
    );
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return (
      <HomePageClient
        locale={locale}
        topStories={[]}
        editorsPicks={[]}
        trending={[]}
      />
    );
  }
}
