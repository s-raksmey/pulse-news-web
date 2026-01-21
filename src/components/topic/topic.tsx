"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { EmptyState } from "@/components/category/empty-state";

/* =========================
   Types
========================= */
type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  topic?: string | null;
  publishedAt?: string | null;
  contentJson?: any;
};

type TopicMeta = {
  title: string;
  category: {
    name: string;
    slug: string;
  };
};

/* =========================
   Motion
========================= */
const listVariant: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

/* =========================
   Helpers (MATCH CATEGORY)
========================= */
function titleCase(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(value?: string | null) {
  if (!value) return null;
  const diff = Date.now() - new Date(value).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function extractFirstParagraph(contentJson: any): string | null {
  if (!contentJson) return null;

  let parsed = contentJson;
  if (typeof contentJson === "string") {
    try {
      parsed = JSON.parse(contentJson);
    } catch {
      return null;
    }
  }

  const block = parsed.blocks?.find((b: any) => b.type === "paragraph");
  return block?.data?.text?.replace(/<[^>]+>/g, "") || null;
}

/* =========================
   VIDEO THUMBNAIL (CRITICAL - MATCH CATEGORY)
========================= */
function getVideoThumbnail(url: string): string {
  try {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const u = new URL(url);
      const id =
        u.searchParams.get("v") ||
        u.pathname.split("/").filter(Boolean).pop();
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }

    // Facebook
    if (url.includes("facebook.com")) {
      const match = url.match(/\/videos\/(\d+)/);
      if (match) {
        return `https://graph.facebook.com/${match[1]}/picture`;
      }
    }

    // fb.watch
    if (url.includes("fb.watch")) {
      const id = url.split("fb.watch/")[1]?.split(/[/?]/)[0];
      if (id) {
        return `https://graph.facebook.com/${id}/picture`;
      }
    }
  } catch {}

  // fallback black image
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgdmlld0JveD0iMCAwIDY0MCAzNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0MCIgaGVpZ2h0PSIzNjAiIGZpbGw9IiMwMDAiIC8+PC9zdmc+";
}

/* =========================
   MEDIA EXTRACTION (IMAGE + VIDEO) - UPDATED
========================= */
function extractFirstMedia(contentJson: any): {
  type: "image" | "video" | null;
  url: string | null;
  thumbnailUrl?: string | null;
} {
  if (!contentJson) return { type: null, url: null };

  let parsed = contentJson;
  if (typeof contentJson === "string") {
    try {
      parsed = JSON.parse(contentJson);
    } catch {
      return { type: null, url: null };
    }
  }

  const block = parsed.blocks?.find(
    (b: any) => b.type === "image" || b.type === "video"
  );

  if (!block) return { type: null, url: null };

  if (block.type === "image") {
    const url =
      block.data?.url ||
      block.data?.file?.url ||
      block.data?.src;

    return url ? { type: "image", url } : { type: null, url: null };
  }

  if (block.type === "video") {
    const rawUrl =
      block.data?.embed ||
      block.data?.url ||
      block.data?.source ||
      block.data?.file?.url;

    if (!rawUrl) return { type: null, url: null };

    // Get thumbnail URL for video
    const thumbnailUrl = getVideoThumbnail(rawUrl);
    
    return { 
      type: "video", 
      url: rawUrl,
      thumbnailUrl 
    };
  }

  return { type: null, url: null };
}

/* =========================
   Page
========================= */
export default function TopicClient({
  category,
  topic,
  topicMeta,
  articles,
}: {
  category: string;
  topic: string;
  topicMeta: TopicMeta | null;
  articles?: Article[];
}) {
  /* ⏳ LOADING */
  if (!articles) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-6"
          >
            <div className="h-[180px] bg-gray-100 rounded-lg animate-pulse" />
            <div className="space-y-3">
              <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
            </div>
          </div>
        ))}
      </main>
    );
  }

  /* 📭 EMPTY */
  if (articles.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: topicMeta?.category.name || category, href: `/${category}` },
            { label: titleCase(topic) },
          ]}
        />
        <EmptyState
          title="No articles for this topic"
          description="There are no published articles under this topic yet."
        />
      </main>
    );
  }

  /* ✅ CONTENT */
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: topicMeta?.category.name || category, href: `/${category}` },
            { label: titleCase(topic) },
          ]}
        />

        <motion.section
          variants={listVariant}
          initial="hidden"
          animate="show"
          className="divide-y"
        >
          {articles.map((a) => {
            const media = extractFirstMedia(a.contentJson);
            const paragraph = extractFirstParagraph(a.contentJson);

            return (
              <motion.article
                key={a.id}
                variants={itemVariant}
                className="py-8 grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-6"
              >
                {/* IMAGE */}
                {media.type === "image" && media.url && (
                  <Link href={`/${category}/${topic}/${a.slug}`}>
                    <div className="relative h-[180px] rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={media.url}
                        alt={a.title}
                        fill
                        className="object-cover"
                        sizes="280px"
                      />
                    </div>
                  </Link>
                )}

                {/* VIDEO - NOW USING THUMBNAIL LIKE CATEGORY */}
                {media.type === "video" && media.thumbnailUrl && (
                  <Link href={`/${category}/${topic}/${a.slug}`}>
                    <div className="relative h-[180px] rounded-lg overflow-hidden bg-black">
                      {/* Using img instead of Image for external URLs that might not be configured in Next.js */}
                      <img
                        src={media.thumbnailUrl}
                        alt={a.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      {/* Play overlay - same as CategoryClient */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-14 w-14 rounded-full bg-black/60 flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="white"
                            className="h-7 w-7 ml-1"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* CONTENT */}
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold hover:underline">
                    <Link href={`/${category}/${topic}/${a.slug}`}>
                      {a.title}
                    </Link>
                  </h2>

                  {(a.excerpt || paragraph) && (
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {a.excerpt || paragraph}
                    </p>
                  )}

                  <div className="text-xs text-gray-500 flex gap-2">
                    <span>{timeAgo(a.publishedAt)}</span>
                    {a.topic && (
                      <>
                        <span>•</span>
                        <Link href={`/${category}/${a.topic}`}>
                          {titleCase(a.topic)}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.section>
      </div>
    </main>
  );
}