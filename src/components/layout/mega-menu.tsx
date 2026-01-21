"use client";

import Link from "next/link";
import { MEGA_NAV } from "@/data/mega-nav";

export default function MegaMenu({ activeKey }: { activeKey: string | null }) {
  if (!activeKey) return null;

  const data = MEGA_NAV[activeKey];
  if (!data) return null;

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
