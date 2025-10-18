import { Variants } from 'framer-motion';

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };
  
  export const fadeInUp: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };
  
  export const scaleIn: Variants = {
    hidden: {
      scale: 0.95,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };
  
  export const fadeInLeft: Variants = {
      hidden: { 
          opacity: 0, 
          x: -40 
      },
      visible: { 
          opacity: 1, 
          x: 0,
          transition: {
              duration: 0.7,
              ease: 'easeOut'
          }
      }
  };
  
  export const fadeInRight: Variants = {
      hidden: { 
          opacity: 0, 
          x: 40 
      },
      visible: { 
          opacity: 1, 
          x: 0,
          transition: {
              duration: 0.7,
              ease: 'easeOut'
          }
      }
  };