"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getGqlClient } from "@/services/graphql-client";
import { Q_TOPICS_BY_CATEGORY } from "@/services/article.gql";

interface Topic {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface DynamicMegaMenuProps {
  activeKey: string | null;
  categoryName?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function DynamicMegaMenu({ activeKey, categoryName, onMouseEnter, onMouseLeave }: DynamicMegaMenuProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activeKey || activeKey === "home") {
      setTopics([]);
      return;
    }

    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        console.log(`🔄 Fetching topics for category: ${activeKey}`);
        
        const client = getGqlClient();
        const response = await client.request(Q_TOPICS_BY_CATEGORY, {
          categorySlug: activeKey
        });

        if (response?.topicsByCategory) {
          console.log(`✅ Found ${response.topicsByCategory.length} topics for ${activeKey}:`, response.topicsByCategory);
          setTopics(response.topicsByCategory);
        } else {
          console.log(`📭 No topics found for category: ${activeKey}`);
          setTopics([]);
        }
      } catch (error) {
        console.error(`❌ Failed to fetch topics for ${activeKey}:`, error);
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [activeKey]);

  if (!activeKey || activeKey === "home") return null;

  const displayName = categoryName || activeKey.charAt(0).toUpperCase() + activeKey.slice(1);

  return (
    <div 
      className="absolute inset-x-0 top-full border-t border-slate-200 bg-white shadow-lg"
      onMouseEnter={() => {
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        onMouseLeave?.();
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-500">Loading topics...</div>
          </div>
        ) : topics.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-3">
            {/* Topics Section */}
            <div>
              <p className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wide">
                Explore {displayName}
              </p>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href={`/${activeKey}`} 
                    className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    All {displayName}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${activeKey}/latest`} 
                    className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    Latest
                  </Link>
                </li>
                {topics.slice(0, 4).map((topic) => (
                  <li key={topic.id}>
                    <Link 
                      href={`/${activeKey}/${topic.slug}`} 
                      className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {topic.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* More Topics Section (if we have more than 4) */}
            {topics.length > 4 && (
              <div>
                <p className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wide">
                  More Topics
                </p>
                <ul className="space-y-2">
                  {topics.slice(4, 8).map((topic) => (
                    <li key={topic.id}>
                      <Link 
                        href={`/${activeKey}/${topic.slug}`} 
                        className="text-slate-700 hover:text-blue-600 transition-colors"
                      >
                        {topic.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Links Section */}
            <div>
              <p className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wide">
                Quick Links
              </p>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href={`/${activeKey}/latest`} 
                    className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Latest News
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${activeKey}/trending`} 
                    className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Trending
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${activeKey}/featured`} 
                    className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Featured Stories
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${activeKey}`} 
                    className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    View All Topics
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          // Show basic dropdown when no topics are available
          <div className="grid gap-8 md:grid-cols-2">
            {/* Category Section */}
            <div>
              <p className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wide">
                Explore {displayName}
              </p>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href={`/${activeKey}`} 
                    className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    All {displayName}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${activeKey}/latest`} 
                    className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    Latest Articles
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${activeKey}/featured`} 
                    className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    Featured Stories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Info Section */}
            <div>
              <p className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wide">
                About This Category
              </p>
              <div className="space-y-2">
                <p className="text-slate-600">
                  Discover the latest news and stories in {displayName.toLowerCase()}.
                </p>
                <p className="text-sm text-slate-500">
                  Topics will appear here as they are created by our editorial team.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
