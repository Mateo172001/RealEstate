export function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="animate-pulse">
          {/* Back button skeleton */}
          <div className="h-10 w-32 bg-muted rounded-md mb-8" />
          
          {/* Image skeleton */}
          <div className="w-full h-[500px] bg-muted rounded-xl mb-8" />
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title skeleton */}
              <div className="space-y-3">
                <div className="h-10 w-3/4 bg-muted rounded" />
                <div className="h-6 w-1/2 bg-muted rounded" />
                <div className="h-12 w-1/3 bg-muted rounded" />
              </div>
              
              {/* Description skeleton */}
              <div className="border-t pt-6 space-y-3">
                <div className="h-8 w-1/4 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
              
              {/* Features skeleton */}
              <div className="border-t pt-6 space-y-4">
                <div className="h-8 w-1/4 bg-muted rounded" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="h-20 bg-muted rounded-lg" />
                  <div className="h-20 bg-muted rounded-lg" />
                  <div className="h-20 bg-muted rounded-lg" />
                </div>
              </div>
              
              {/* Details skeleton */}
              <div className="border-t pt-6 space-y-4">
                <div className="h-8 w-1/3 bg-muted rounded" />
                <div className="space-y-3">
                  <div className="h-12 w-full bg-muted rounded" />
                  <div className="h-12 w-full bg-muted rounded" />
                  <div className="h-12 w-full bg-muted rounded" />
                  <div className="h-12 w-full bg-muted rounded" />
                </div>
              </div>
            </div>
            
            {/* Sidebar skeleton */}
            <div className="lg:col-span-1">
              <div className="border rounded-xl p-6 space-y-4">
                <div className="h-8 w-3/4 bg-muted rounded" />
                <div className="h-12 w-full bg-muted rounded" />
                <div className="h-12 w-full bg-muted rounded" />
                <div className="border-t pt-4 mt-4 space-y-2">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

