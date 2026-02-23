"use client";

import Link from "next/link";
import { MEGA_NAV } from "@/data/mega-nav";

export default function MegaMenu({ activeKey }: { activeKey: string | null }) {
  if (!activeKey) return null;

  const data = MEGA_NAV[activeKey];
  
  // If no static configuration exists, create a dynamic one for the category
  if (!data) {
    const dynamicData = {
      root: { label: activeKey.charAt(0).toUpperCase() + activeKey.slice(1), href: `/${activeKey}` },
      explore: {
        title: `Explore ${activeKey.charAt(0).toUpperCase() + activeKey.slice(1)}`,
        items: [
          { label: "Latest", href: `/${activeKey}/latest` },
          { label: "Popular", href: `/${activeKey}/popular` },
          { label: "Featured", href: `/${activeKey}/featured` },
        ],
      },
      shop: {
        title: `${activeKey.charAt(0).toUpperCase() + activeKey.slice(1)} Coverage`,
        items: [
          { label: "Latest", href: `/${activeKey}/latest` },
          { label: "Analysis", href: `/${activeKey}/analysis` },
        ],
      },
      more: {
        title: `More from ${activeKey.charAt(0).toUpperCase() + activeKey.slice(1)}`,
        items: [
          { label: "Archive", href: `/${activeKey}/archive` },
        ],
      },
    };
    
    return (
      <div className="absolute inset-x-0 top-full border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <p className="mb-4 text-sm text-slate-500">{dynamicData.explore.title}</p>
              <ul className="space-y-3">
                {dynamicData.explore.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-lg font-semibold hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-sm text-slate-500">{dynamicData.shop.title}</p>
              <ul className="space-y-2">
                {dynamicData.shop.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-sm text-slate-500">{dynamicData.more.title}</p>
              <ul className="space-y-2">
                {dynamicData.more.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-x-0 top-full border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="mb-4 text-sm text-slate-500">{data.explore.title}</p>
            <ul className="space-y-3">
              {data.explore.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-lg font-semibold hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm text-slate-500">{data.shop.title}</p>
            <ul className="space-y-2">
              {data.shop.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm text-slate-500">{data.more.title}</p>
            <ul className="space-y-2">
              {data.more.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
