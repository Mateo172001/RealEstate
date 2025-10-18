'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Heart, 
  Share2, 
  Phone, 
  Mail,
  Home,
  DollarSign
} from 'lucide-react';
import { usePropertyById } from '@/lib/hooks/useProperties';
import { PropertyDetailSkeleton } from '@/components/property/PropertyDetailSkeleton';
import { PropertyNotFound } from '@/components/shared/PropertyNotFound';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils/formatters';
import { fadeInUp, staggerContainer } from '@/lib/utils/animations';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const { data: property, isLoading, error } = usePropertyById(propertyId);

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return <PropertyNotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Image Section */}
          <motion.div variants={fadeInUp} className="relative">
            <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={property.imageUrl}
                alt={property.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              
              {/* Overlay with status badge */}
              <div className="absolute top-4 right-4">
                <Badge variant="default" className="text-base px-4 py-2">
                  For Sale
                </Badge>
              </div>

              {/* Action buttons */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full backdrop-blur-sm bg-background/80 hover:bg-background/90"
                  onClick={() => {
                    console.log('Share property:', property.id);
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full backdrop-blur-sm bg-background/80 hover:bg-background/90"
                  onClick={() => {
                    console.log('Add to favorites:', property.id);
                  }}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-6">
              {/* Title and Price */}
              <div>
                <h1 className="text-4xl font-bold mb-3">{property.name}</h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{property.address}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <span className="text-5xl font-extrabold text-primary">
                    {formatPrice(property.price)}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  This magnificent property located at {property.address} represents a 
                  unique opportunity in the real estate market. With modern design and 
                  top-quality finishes, this property offers the perfect balance 
                  between elegance and functionality.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg mt-4">
                  Ideal for those seeking a solid investment or their dream home, 
                  this property has all the amenities needed for a comfortable and 
                  sophisticated lifestyle.
                </p>
              </div>

              {/* Features Section */}
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-accent/50">
                    <Home className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-semibold">Residential</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-accent/50">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold">Available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-accent/50">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Price/sqft</p>
                      <p className="font-semibold">Contact</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">Property Details</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b">
                    <dt className="text-muted-foreground">Property ID</dt>
                    <dd className="font-semibold">{property.id.slice(0, 8)}...</dd>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <dt className="text-muted-foreground">Owner</dt>
                    <dd className="font-semibold">{property.idOwner}</dd>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="font-semibold text-green-600">Available</dd>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <dt className="text-muted-foreground">Price</dt>
                    <dd className="font-semibold">{formatPrice(property.price)}</dd>
                  </div>
                </dl>
              </div>
            </motion.div>

            {/* Sidebar - Contact Form */}
            <motion.div variants={fadeInUp} className="lg:col-span-1">
              <div className="sticky top-8 border rounded-xl p-6 bg-card shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Contact Agent</h2>
                
                <div className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now
                  </Button>
                  
                  <Button className="w-full" size="lg" variant="outline">
                    <Mail className="mr-2 h-5 w-5" />
                    Send Email
                  </Button>
                  
                  <div className="border-t pt-4 mt-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Interested in this property? Contact us for more information 
                      or to schedule a visit.
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>contact@realestate.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <h3 className="font-semibold mb-3">Business Hours</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

