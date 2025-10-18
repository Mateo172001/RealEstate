'use client';

import { useQuery } from '@tanstack/react-query';
import { getProperties, getPropertyById } from '@/lib/api/properties';
import { PropertyFilters } from '@/types/property';

/**
 * A custom hook to get the list of properties using React Query.
 *
 * @param filters - The filters to apply in the query.
 * @returns The state of the React Query query (data, isLoading, isError, etc.).
 */
export function useProperties(filters: PropertyFilters) {
  return useQuery({
    // Query Key: Include all filters for granular cache
    // Each combination of filters is cached separately
    queryKey: ['properties', filters],

    queryFn: () => getProperties(filters),

    // Optimized configuration for pagination:
    // staleTime: 5 minutes for the list of properties
    staleTime: 5 * 60 * 1000,

    // gcTime: 10 minutes - keeps visited pages in memory
    gcTime: 10 * 60 * 1000,

    // retry: 2 retries in case of error
    retry: 2,

    // refetchOnWindowFocus: false - no refetch when returning to the tab
    refetchOnWindowFocus: false,

    // refetchOnMount: false - uses cache if available
    // This makes visiting a page already visited instant.
    refetchOnMount: false,

    placeholderData: (previousData) => previousData,
  });
}

/**
 * A custom hook to get a specific property by its ID using React Query.
 *
 * @param propertyId - The ID of the property to obtain.
 * @returns The state of the React Query query (data, isLoading, isError, etc.).
 */
export function usePropertyById(propertyId: string) {
  return useQuery({
    // Query Key: Include the specific ID for granular cache
    // Each property is cached individually
    queryKey: ['property', propertyId],

    queryFn: () => getPropertyById(propertyId),

    // Executes the query if we have a valid ID
    enabled: !!propertyId,

    // staleTime: 10 minutes. The individual properties are more stable
    // than the complete list, so we can cache them for more time
    staleTime: 10 * 60 * 1000,

    // gcTime: 15 minutes. Keep the visited properties in cache for more time for fast navigation between details
    gcTime: 15 * 60 * 1000,

    retry: 1,

    refetchOnWindowFocus: false,

    refetchOnMount: false,
  });
}