import { PropertySkeleton } from "../property/PropertySkeleton";

interface PropertyGridSkeletonProps {
  count?: number;
  showHeader?: boolean;
}

export function PropertyGridSkeleton({ count = 6, showHeader = true }: PropertyGridSkeletonProps) {
  return (
    <section className={showHeader ? "py-24 bg-secondary" : ""}>
      <div className={showHeader ? "container mx-auto px-4" : ""}>
        {showHeader && (
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="h-10 bg-muted rounded w-1/2 mx-auto mb-4" />
            <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: count }).map((_, i) => (
            <PropertySkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}