import { getProperties } from '@/lib/api/properties';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export async function FeaturedPropertiesSection() {
  try {
    const { items: properties } = await getProperties({ page: 1, pageSize: 6 });

    if (!properties || properties.length === 0) {
      return null;
    }

    return (
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-muted-foreground">
              Discover our exclusive selection of the finest properties available.
            </p>
          </div>

          <PropertyGrid properties={properties} />

          <div className="text-center mt-16">
            <Button asChild size="lg">
              <Link href="/properties">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Failed to fetch featured properties:", error);
    return null;
  }
}