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
          <div className="grid gap-8 md:grid-cols-2">
            {/* Admin-Created Topics Only */}
            <div>
              <p className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wide">
                {displayName} Topics
              </p>
              <ul className="space-y-3">
                {topics.slice(0, 6).map((topic) => (
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

            {/* More Topics Section (if we have more than 6) */}
            {topics.length > 6 && (
              <div>
                <p className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wide">
                  More Topics
                </p>
                <ul className="space-y-2">
                  {topics.slice(6, 12).map((topic) => (
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
                
                {/* Show "View All" link only if there are many topics */}
                {topics.length > 12 && (
                  <div className="pt-3 mt-3 border-t border-slate-200">
                    <Link 
                      href={`/${activeKey}`} 
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      View all {topics.length} topics →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Show clean empty state when no topics are available
          <div className="text-center py-8">
            <div className="space-y-3">
              <p className="text-slate-600 text-lg">
                No topics available yet for {displayName}
              </p>
              <p className="text-sm text-slate-500">
                Topics will appear here as they are created by our editorial team.
              </p>
              <div className="pt-4">
                <Link 
                  href={`/${activeKey}`} 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Browse {displayName} Articles →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
