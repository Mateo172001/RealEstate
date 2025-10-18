'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { PropertyFilters as FiltersType } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { formatPrice } from '@/lib/utils/formatters';
import { Filter, ChevronDown, Search } from 'lucide-react';

const initialFilters: FiltersType = {
  name: '',
  address: '',
  minPrice: 0,
  maxPrice: 2000000,
};

interface PropertyFiltersProps {
  onFilterChange: (filters: FiltersType) => void;
  isSearching?: boolean;
}

export function PropertyFilters({ onFilterChange, isSearching = false }: PropertyFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState<FiltersType>(initialFilters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, minPrice: value[0], maxPrice: value[1] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };
  
  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 py-3 bg-card text-foreground 
                 rounded-lg shadow-md border w-full md:w-auto justify-between"
      >
        <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <span className="font-semibold">Filters</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mt-4 p-6 bg-card rounded-lg shadow-md border overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Modern Villa"
                  value={filters.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Location</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="e.g. New York"
                  value={filters.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center">
                  <Label>Price Range</Label>
                  <span className="text-sm font-medium text-primary">
                    {formatPrice(filters.minPrice!)} - {formatPrice(filters.maxPrice!)}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={2000000}
                  step={50000}
                  value={[filters.minPrice!, filters.maxPrice!]}
                  onValueChange={handlePriceChange}
                />
              </div>
              
              <div className="space-y-2">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full" 
                  variant="outline"
                  disabled={isSearching}
                >
                  <Search className={`mr-2 h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
                  {isSearching ? 'Searching...' : 'Search Now'}
                </Button>
                {isSearching && (
                  <p className="text-xs text-muted-foreground text-center">
                    Searching properties...
                  </p>
                )}
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}