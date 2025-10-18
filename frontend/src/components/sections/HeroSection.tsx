'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import PropertySearchFilters from '@/components/sections/PropertySearchFilters';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';

interface HeroSectionProps {
  onSearch: (filters: { name: string; address: string; minPrice: number; maxPrice: number }) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center md:w-[95%] w-full mx-auto rounded-b-3xl overflow-hidden">
      <Image
        src="/images/hero-background.jpg"
        alt="Modern property"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative container mx-auto px-4 text-center text-white">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Discover Your Perfect Property Today
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/80"
          >
            Real estate properties for sale and rent in over 12+ countries
          </motion.p>
        </motion.div>

        <PropertySearchFilters onSearch={onSearch} />
      </div>
    </section>
  );
}