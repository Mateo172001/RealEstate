'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';

interface PropertySearchFiltersProps {
  onSearch: (filters: { name: string; address: string; minPrice: number; maxPrice: number }) => void;
}

export default function PropertySearchFilters({ onSearch }: PropertySearchFiltersProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      name,
      address,
      minPrice: 0,
      maxPrice: 2000000,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      className="mt-12 max-w-4xl mx-auto bg-background p-6 rounded-lg shadow-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm text-foreground font-medium flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            Property Name
          </label>
          <Input
            placeholder="e.g. Modern Villa, Beach House..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-foreground font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Location
          </label>
          <Input
            placeholder="e.g. New York, California..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-background text-foreground"
          />
        </div>
        
        <Button type="submit" size="lg" className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search Properties
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Start typing to search, or leave empty to see all properties
      </p>
    </motion.form>
  );
}