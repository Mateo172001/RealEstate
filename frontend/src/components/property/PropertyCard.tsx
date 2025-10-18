'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Property } from '@/types/property';
import { formatPrice } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fadeInUp } from '@/lib/utils/animations';

interface PropertyCardProps {
  property: Property;
  index?: number; 
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -8, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group"
    >
      <Link href={`/properties/${property.id}`} className="block">
        <div className="bg-background rounded-xl shadow-md border overflow-hidden h-full flex flex-col">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={property.imageUrl}
              alt={property.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="absolute top-3 right-3">
              <Badge variant="secondary">For Sale</Badge>
            </div>
          </div>

          <div className="p-6 flex-grow flex flex-col">
            <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {property.name}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
              {property.address}
            </p>

            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-xl font-extrabold text-primary">
                {formatPrice(property.price)}
              </p>
              
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Favorited:', property.id);
                }}
              >
                <Heart className="w-5 h-5 text-muted-foreground group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}