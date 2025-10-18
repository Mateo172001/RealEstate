'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeroSection } from "@/components/sections/HeroSection";
import { useProperties } from '@/lib/hooks/useProperties';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyGridSkeleton } from '@/components/property/PropertyGridSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { ArrowRight, Grid3x3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [searchFilters, setSearchFilters] = useState<{
    name: string;
    address: string;
    minPrice: number;
    maxPrice: number;
  } | null>(null);

  const { data, isLoading, isError, error, refetch } = useProperties(
    searchFilters 
      ? { ...searchFilters, page: 1, pageSize: 6 } 
      : { page: 1, pageSize: 6 }
  );

  const handleSearch = (filters: { name: string; address: string; minPrice: number; maxPrice: number }) => {
    setSearchFilters(filters);
  };

  const hasActiveSearch = searchFilters && (searchFilters.name || searchFilters.address);

  return (
    <>
      <HeroSection onSearch={handleSearch} />

      {(hasActiveSearch || data) && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {hasActiveSearch ? 'Search Results' : 'Featured Properties'}
              </h2>
              <p className="text-muted-foreground">
                {hasActiveSearch 
                  ? `Found ${data?.totalCount || 0} properties matching your search`
                  : 'Discover our handpicked selection of premium properties'
                }
              </p>
            </div>

            <Link href="/properties">
              <Button size="lg" variant="default" className="gap-2">
                <Grid3x3 className="w-5 h-5" />
                View All Properties
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-8">
            {isLoading && <PropertyGridSkeleton count={6} showHeader={false} />}

            {isError && (
              <ErrorState 
                title="Failed to Load Properties" 
                message={error?.message || 'Something went wrong'} 
                onRetry={refetch} 
              />
            )}

            {!isLoading && !isError && data && data.items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PropertyGrid properties={data.items} />
                
                {data.totalCount > 6 && (
                  <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      Showing {data.items.length} of {data.totalCount} properties
                    </p>
                    <Link href="/properties">
                      <Button size="lg" variant="outline" className="gap-2">
                        View All {data.totalCount} Properties
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {!isLoading && !isError && data && data.items.length === 0 && (
              <EmptyState 
                title="No Properties Found" 
                message="Try adjusting your search criteria or browse all properties"
                action={
                  <Link href="/properties">
                    <Button size="lg" className="gap-2">
                      <Grid3x3 className="w-5 h-5" />
                      Browse All Properties
                    </Button>
                  </Link>
                }
              />
            )}
          </div>
        </section>
      )}
    </>
  );
}
