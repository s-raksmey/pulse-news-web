"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Home, Globe, Laptop, Briefcase, Vote, Trophy, Palette } from "lucide-react";
import { getTranslations, type Locale } from "@/lib/i18n";

interface MobileMenuProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { key: "home", href: "/", icon: Home },
  { key: "world", href: "/world", icon: Globe },
  { key: "tech", href: "/tech", icon: Laptop },
  { key: "business", href: "/business", icon: Briefcase },
  { key: "politics", href: "/politics", icon: Vote },
  { key: "sports", href: "/sports", icon: Trophy },
  { key: "culture", href: "/culture", icon: Palette },
];

const menuVariants = {
  closed: {
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: 20 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

export default function MobileMenu({ locale, isOpen, onClose }: MobileMenuProps) {
  const t = getTranslations(locale);
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <Link href="/" onClick={onClose} className="font-semibold tracking-wide">
                PULSE <span className="text-xs text-slate-500">NEWS</span>
              </Link>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {NAV_ITEMS.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.key}
                      custom={index}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-4 rounded-lg p-3 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{t.nav[item.key as keyof typeof t.nav]}</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-slate-400" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-slate-200" />

              {/* Additional Links */}
              <div className="space-y-2">
                <motion.div
                  custom={NAV_ITEMS.length}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                >
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-lg p-3 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <span className="font-medium">{t.mobile.cmsDashboard}</span>
                    <ChevronRight className="ml-auto h-4 w-4 text-slate-400" />
                  </Link>
                </motion.div>
              </div>
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-200 p-6">
              <motion.div
                custom={NAV_ITEMS.length + 1}
                variants={itemVariants}
                initial="closed"
                animate="open"
                className="text-center"
              >
                <p className="text-sm text-slate-500">
                  {t.mobile.stayInformed}
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  {[
                    { name: "Twitter", icon: "🐦", url: "#" },
                    { name: "Facebook", icon: "📘", url: "#" },
                    { name: "Instagram", icon: "📷", url: "#" },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg transition-colors hover:bg-slate-200"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
