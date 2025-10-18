export function PropertySkeleton() {
    return (
      <div className="rounded-xl bg-background shadow-md border overflow-hidden">
        <div className="relative aspect-[16/10] bg-muted shimmer overflow-hidden">
        </div>
        
        <div className="p-6 space-y-4">
          <div className="h-6 w-3/4 bg-muted rounded-md animate-pulse" />
          
          <div className="h-4 w-full bg-muted rounded-md animate-pulse" />
          
          <div className="flex justify-between items-center pt-2">
            <div className="h-8 w-1/3 bg-muted rounded-md animate-pulse" />
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }