import { motion, cubicBezier } from 'framer-motion';

const EASE = cubicBezier(0.22, 1, 0.36, 1);

export function SectionDivider({ variant = 'gold' }: { variant?: 'gold' | 'subtle' }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.2, ease: EASE }}
      className="flex items-center justify-center py-2"
    >
      <div
        className={`w-full max-w-md h-px ${
          variant === 'gold'
            ? 'bg-gradient-to-r from-transparent via-primary/30 to-transparent'
            : 'bg-gradient-to-r from-transparent via-white/5 to-transparent'
        }`}
      />
    </motion.div>
  );
}
