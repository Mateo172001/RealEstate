'use client';

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyNotFoundProps {
  message?: string;
  showBackButton?: boolean;
}

export function PropertyNotFound({ 
  message = "Sorry, we couldn't find this property.",
  showBackButton = true 
}: PropertyNotFoundProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
        <p className="text-muted-foreground mb-6">
          {message}
        </p>
        {showBackButton && (
          <Button onClick={() => router.push('/properties')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        )}
      </div>
    </div>
  );
}

