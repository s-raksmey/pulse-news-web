// app/(public)/page.tsx
import { cookies } from "next/headers";
import { getGqlClient } from "@/services/graphql-client";
import {
  Q_TOP_STORIES,
  Q_EDITORS_PICKS,
  Q_TRENDING,
} from "@/services/article.gql";
import HomePageClient from "@/components/home/home";

export const revalidate = 60;

export default async function HomePage() {
  const client = getGqlClient();
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get("locale")?.value;
  const locale = requestedLocale === "km" ? "km" : "en";

  try {
    const [top, picks, trending] = await Promise.all([
      client.request(Q_TOP_STORIES).catch(() => ({ topStories: [] })),
      client.request(Q_EDITORS_PICKS).catch(() => ({ editorsPicks: [] })),
      client.request(Q_TRENDING).catch(() => ({ trending: [] })),
    ]);

    return (
      <HomePageClient
        locale={locale}
        topStories={top?.topStories ?? []}
        editorsPicks={picks?.editorsPicks ?? []}
        trending={trending?.trending ?? []}
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
