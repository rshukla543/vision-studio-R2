import { motion, cubicBezier } from 'framer-motion';

const EASE = cubicBezier(0.22, 1, 0.36, 1);

type SectionDividerProps = {
  variant?: 'gold' | 'subtle' | 'elegant';
  className?: string;
};

export function SectionDivider({ variant = 'gold', className = '' }: SectionDividerProps) {
  const variants = {
    gold: 'bg-gradient-to-r from-transparent via-primary/40 to-transparent',
    subtle: 'bg-gradient-to-r from-transparent via-white/10 to-transparent',
    elegant: 'bg-gradient-to-r from-transparent via-primary/60 to-transparent',
  };

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.2, ease: EASE }}
      className={`flex items-center justify-center py-2 ${className}`}
    >
      <div className={`w-full max-w-md h-px ${variants[variant]}`} />
    </motion.div>
  );
}

// Enhanced divider with ornament for luxury sections
export function ElegantDivider({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: EASE }}
      className={`flex items-center justify-center gap-4 py-2 ${className}`}
    >
      <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-primary/30" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
      <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-primary/30" />
    </motion.div>
  );
}
