// src/components/ui/skeleton.tsx
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  );
}

// Article card skeleton
function ArticleCardSkeleton({ layout = "vertical" }: { layout?: "vertical" | "horizontal" }) {
  if (layout === "horizontal") {
    return (
      <div className="flex gap-4 p-4 bg-white rounded-lg border border-slate-200">
        <Skeleton className="w-32 h-24 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

// Hero section skeleton
function HeroSkeleton() {
  return (
    <div className="relative bg-slate-100 h-96">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-8 left-8 right-8 space-y-4">
        <Skeleton className="h-8 w-3/4 bg-slate-300" />
        <Skeleton className="h-4 w-1/2 bg-slate-300" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16 bg-slate-300" />
          <Skeleton className="h-3 w-20 bg-slate-300" />
        </div>
      </div>
    </div>
  );
}

// Home page skeleton
function HomePageSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Skeleton */}
      <HeroSkeleton />

      {/* Main Content Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Editor's Picks Section */}
            <section className="space-y-8">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ArticleCardSkeleton key={index} layout="vertical" />
                ))}
              </div>
            </section>

            {/* Latest News Section */}
            <section className="space-y-8">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>

              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <ArticleCardSkeleton key={index} layout="horizontal" />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex gap-3">
                      <Skeleton className="w-16 h-12 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export { Skeleton, ArticleCardSkeleton, HeroSkeleton, HomePageSkeleton };

