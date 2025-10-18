'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "An Error Occurred",
  message = "We couldn't load the requested data. Please try again later.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-16 px-4 bg-destructive/10 border border-destructive/20 text-destructive-foreground rounded-lg"
      role="alert"
    >
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      
      <p className="max-w-md text-destructive/80 mb-6">
        {message}
      </p>

      {onRetry && (
        <Button onClick={onRetry} variant="destructive">
          Try Again
        </Button>
      )}
    </motion.div>
  );
}