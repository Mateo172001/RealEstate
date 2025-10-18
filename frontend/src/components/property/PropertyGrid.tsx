'use client';

import { Property } from '@/types/property';
import { PropertyCard } from '@/components/property/PropertyCard';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/utils/animations';
import { EmptyState } from '@/components/shared/EmptyState';

interface PropertyGridProps {
  properties: Property[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (!properties || properties.length === 0) {
    return <EmptyState title="No Properties Found" message="Try adjusting your search filters to find what you're looking for." />;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {properties.map((property, index) => (
        <PropertyCard key={property.id} property={property} index={index} />
      ))}
    </motion.div>
  );
}