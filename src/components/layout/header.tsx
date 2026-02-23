"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Search, Menu } from "lucide-react";
import MegaMenu from "@/components/layout/mega-menu";
import LanguageToggle from "@/components/layout/language-toggle";
import MobileMenu from "@/components/layout/mobile-menu";
import SearchBar from "@/components/layout/search-bar";
import { getTranslations } from "@/lib/i18n";
import { useCategories } from "@/hooks/useGraphQL";
import { ArticleCategory } from "@/types/article";

// Static navigation items (home stays static)
const STATIC_NAV_ITEMS = [
  { key: "home", href: "/" },
];

// Fallback categories in case API fails
const FALLBACK_CATEGORIES = [
  { key: "world", href: "/world" },
  { key: "tech", href: "/tech" },
  { key: "business", href: "/business" },
  { key: "politics", href: "/politics" },
  { key: "sports", href: "/sports" },
  { key: "culture", href: "/culture" },
];

type HeaderProps = {
  locale: "en" | "km";
};

export default function Header({ locale }: HeaderProps) {
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const t = getTranslations(locale);
  const { getCategories } = useCategories();

  // Fetch categories on component mount with retry logic
  useEffect(() => {
    const fetchCategories = async (retryCount = 0) => {
      try {
        setIsLoadingCategories(true);
        console.log(`🔄 Fetching categories from GraphQL API... (attempt ${retryCount + 1})`);
        
        const response = await getCategories();
        console.log('📡 GraphQL Response:', response);
        
        if (response && response.categories) {
          console.log('✅ Categories fetched successfully:', response.categories);
          setCategories(response.categories);
        } else {
          console.warn('⚠️ No categories in response or request failed:', response);
          
          // Retry up to 2 times if the request failed
          if (retryCount < 2) {
            console.log(`🔄 Retrying in 1 second... (attempt ${retryCount + 2})`);
            setTimeout(() => fetchCategories(retryCount + 1), 1000);
            return;
          }
          
          console.log('🔄 Max retries reached, using fallback categories');
        }
      } catch (error) {
        console.error('❌ Failed to fetch categories:', error);
        
        // Retry up to 2 times if there was an error
        if (retryCount < 2) {
          console.log(`🔄 Retrying in 1 second... (attempt ${retryCount + 2})`);
          setTimeout(() => fetchCategories(retryCount + 1), 1000);
          return;
        }
        
        console.log('🔄 Max retries reached, using fallback categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [getCategories]);

  // Combine static items with dynamic categories
  const navItems = [
    ...STATIC_NAV_ITEMS,
    ...(categories.length > 0 
      ? categories.map(category => ({
          key: category.slug,
          href: `/${category.slug}`,
          label: category.name
        }))
      : FALLBACK_CATEGORIES
    )
  ];

  // Debug logging for navigation items
  console.log('🧭 Navigation items being rendered:', {
    categoriesCount: categories.length,
    isLoadingCategories,
    navItems: navItems.map(item => ({ key: item.key, label: 'label' in item ? item.label : item.key }))
  });

  return (
    <>
      <header className="relative z-50 border-b bg-white" onMouseLeave={() => setActive(null)}>
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center" aria-label="Pulse News Home">
              <img
                src="/assets/pulse-news-logo.svg"
                alt="Pulse News Logo"
                className="h-10 w-auto"
                style={{ minWidth: 120 }}
              />
            </Link>
          </div>

          <nav className="hidden flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-slate-800 md:flex lg:gap-x-6">
            {navItems.map((item) => {
              const hasDropdown = item.key !== "home";
              const displayName = 'label' in item ? item.label : t.nav[item.key as keyof typeof t.nav];
              
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onMouseEnter={() => setActive(hasDropdown ? item.key : null)}
                  className="flex items-center gap-1 leading-tight text-slate-800 hover:text-[#385CF5]"
                >
                  {displayName}
                  {hasDropdown && (
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        active === item.key ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-[#385CF5]"
              aria-label={t.header.searchLabel}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-3 md:flex">
              <LanguageToggle initialLocale={locale} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-[#385CF5] md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dropdown (keep style) */}
        <MegaMenu activeKey={active} />
      </header>

      {/* Mobile Menu */}
      <MobileMenu locale={locale} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Search Bar */}
      <SearchBar locale={locale} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
