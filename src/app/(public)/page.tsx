// app/(public)/page.tsx
import { cookies } from "next/headers";
import { getGqlClient } from "@/services/graphql-client";
import {
  Q_HOME_PAGE_CATEGORIES,
  Q_FEATURED_ARTICLES,
  Q_TRENDING,
  Q_RECENT_ARTICLES,
} from "@/services/article.gql";
import CategoryHome from "@/components/home/category-home";

export const revalidate = 60;

export default async function HomePage() {
  const client = getGqlClient();
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get("locale")?.value;
  const locale = requestedLocale === "km" ? "km" : "en";

  try {
    // Fetch category data, featured articles, and trending articles
    const [categoryResult, featuredResult, trendingResult] = await Promise.all([
      client.request(Q_HOME_PAGE_CATEGORIES).catch((error) => {
        console.warn("Failed to fetch category data:", error);
        return { world: [], tech: [], business: [], politics: [], sports: [], culture: [] };
      }),
      client.request(Q_FEATURED_ARTICLES, { limit: 5 }).catch((error) => {
        console.warn("Failed to fetch featured articles:", error);
        return { articles: [] };
      }),
      client.request(Q_TRENDING).catch((error) => {
        console.warn("Failed to fetch trending:", error);
        return { trending: [] };
      }),
    ]);

    // Extract data with fallbacks
    const categoryData = {
      world: categoryResult?.world ?? [],
      tech: categoryResult?.tech ?? [],
      business: categoryResult?.business ?? [],
      politics: categoryResult?.politics ?? [],
      sports: categoryResult?.sports ?? [],
      culture: categoryResult?.culture ?? [],
    };
    
    const featuredArticles = featuredResult?.articles ?? [];
    const trendingArticles = trendingResult?.trending ?? [];

    // If all queries returned empty, try fallback with recent articles
    const hasAnyData = featuredArticles.length > 0 || 
      Object.values(categoryData).some(articles => articles.length > 0) ||
      trendingArticles.length > 0;

    if (!hasAnyData) {
      console.warn("All main queries returned empty, trying fallback with recent articles");
      try {
        const recentResult = await client.request(Q_RECENT_ARTICLES, { take: 20 });
        const recentArticles = recentResult?.articles ?? [];
        
        if (recentArticles.length > 0) {
          console.log(`Found ${recentArticles.length} recent articles as fallback`);
          // Distribute recent articles across categories as fallback
          const articlesPerCategory = Math.ceil(recentArticles.length / 6);
          return (
            <CategoryHome
              locale={locale}
              featuredArticles={recentArticles.slice(0, 5)}
              categoryData={{
                world: recentArticles.slice(0, articlesPerCategory),
                tech: recentArticles.slice(articlesPerCategory, articlesPerCategory * 2),
                business: recentArticles.slice(articlesPerCategory * 2, articlesPerCategory * 3),
                politics: recentArticles.slice(articlesPerCategory * 3, articlesPerCategory * 4),
                sports: recentArticles.slice(articlesPerCategory * 4, articlesPerCategory * 5),
                culture: recentArticles.slice(articlesPerCategory * 5, articlesPerCategory * 6),
              }}
              trendingArticles={recentArticles.slice(0, 6)}
            />
          );
        }
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
      }
    }

    return (
      <CategoryHome
        locale={locale}
        featuredArticles={featuredArticles}
        categoryData={categoryData}
        trendingArticles={trendingArticles}
      />
    );
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return (
      <CategoryHome
        locale={locale}
        featuredArticles={[]}
        categoryData={{
          world: [],
          tech: [],
          business: [],
          politics: [],
          sports: [],
          culture: [],
        }}
        trendingArticles={[]}
      />
    );
  }
}
