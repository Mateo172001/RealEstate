'use client';

import { useState, useMemo, useEffect } from 'react';

import { PropertyFilters as FiltersType } from '@/types/property';

import { useProperties } from '@/lib/hooks/useProperties';
import { useDebounce } from '@/lib/hooks/useDebounce';

import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { PropertyGridSkeleton } from '@/components/property/PropertyGridSkeleton';
import { Pagination } from '@/components/shared/Pagination';
import { ErrorState } from '@/components/shared/ErrorState';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/utils/animations';

const initialFilters: FiltersType = {
  page: 1,
  pageSize: 9,
  name: '',
  address: '',
  minPrice: 0,
  maxPrice: 2000000,
};

export default function PropertiesPage() {
  const [activeFilters, setActiveFilters] = useState<FiltersType>(initialFilters);

  const searchFilters = {
    name: activeFilters.name,
    address: activeFilters.address,
    minPrice: activeFilters.minPrice,
    maxPrice: activeFilters.maxPrice,
  };

  const debouncedSearchFilters = useDebounce(searchFilters, 500);

  const finalFilters = useMemo(() => ({
    ...debouncedSearchFilters,
    page: activeFilters.page,
    pageSize: activeFilters.pageSize,
  }), [debouncedSearchFilters, activeFilters.page, activeFilters.pageSize]);

  const { data, isLoading, isError, error, refetch } = useProperties(finalFilters);

  useEffect(() => {
    setActiveFilters(prev => {
      if (prev.page === 1) return prev;
      return { ...prev, page: 1 };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearchFilters.name,
    debouncedSearchFilters.address,
    debouncedSearchFilters.minPrice,
    debouncedSearchFilters.maxPrice,
  ]);

  const handlePageChange = (newPage: number) => {
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = useMemo(() => {
    if (isLoading && !data) {
      return <PropertyGridSkeleton />;
    }

    if (isError) {
      return <ErrorState title="Failed to Load Properties" message={error.message} onRetry={refetch} />;
    }
    
    return <PropertyGrid properties={data?.items || []} />;

  }, [isLoading, isError, data, error, refetch]);

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="text-center mb-10"
      >
        <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-2">
          Find Your Dream Property
        </motion.h1>
        <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
          Browse through our extensive collection of premium properties using powerful search filters.
        </motion.p>
      </motion.div>

      
      <PropertyFilters 
        onFilterChange={setActiveFilters} 
        isSearching={isLoading && !!data}
      />

      <div className={`mt-12 transition-opacity duration-300 ${isLoading && data ? 'opacity-50' : 'opacity-100'}`}>
        {renderContent}
      </div>

      <div className="mt-16 flex justify-center">

        {!isLoading && !isError && data && data.totalPages > 1 && (
          <Pagination
            currentPage={data.pageNumber}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}