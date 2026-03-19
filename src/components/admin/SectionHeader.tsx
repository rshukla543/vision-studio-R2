import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  label: string;
  title: string;
  highlight?: string;
  description?: string;
}

export function AdminSectionHeader({ icon: Icon, label, title, highlight, description }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8"
    >
      {/* Label with icon */}
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
        >
          <Icon className="w-5 h-5 text-primary" />
        </motion.div>
        <div className="flex items-center gap-4 flex-1">
          <span className="text-[11px] font-bold tracking-[0.5em] uppercase text-primary">
            {label}
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-px flex-1 origin-left"
            style={{
              background: 'linear-gradient(90deg, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0.1) 50%, transparent 100%)'
            }}
          />
        </div>
      </div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-6xl font-serif text-white leading-[1.1] tracking-tight"
      >
        {title}
        {highlight && (
          <span className="block italic text-primary/80 mt-1">{highlight}</span>
        )}
      </motion.h2>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-white/50 mt-4 text-base max-w-xl leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
