"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumb({
  items,
}: {
  items: Crumb[];
}) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 text-base text-gray-600 mb-10"
    >
      {items.map((c, i) => {
        const isLast = i === items.length - 1;

        return (
          <span key={i} className="flex items-center gap-3">
            {/* Home icon */}
            {i === 0 && (
              <Home className="w-5 h-5 text-gray-500 relative -top-px" />
            )}

            {/* Link or active label */}
            {c.href && !isLast ? (
              <Link
                href={c.href}
                className="hover:text-blue-600 transition-colors"
              >
                {c.label}
              </Link>
            ) : (
              <span className="relative font-semibold text-gray-900">
                {c.label}

                {/* ✅ UNDERLINE ALWAYS ON LAST ITEM */}
                {isLast && (
                  <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-blue-600 rounded-full" />
                )}
              </span>
            )}

            {/* Separator */}
            {!isLast && (
              <span className="text-gray-400 select-none">›</span>
            )}
          </span>
        );
      })}
    </motion.nav>
  );
}
