import { motion, cubicBezier } from 'framer-motion';
import { ReactNode } from 'react';

const EASE = cubicBezier(0.22, 1, 0.36, 1);

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
