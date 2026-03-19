import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AdminSectionCard({ children, className = '', delay = 0 }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ 
        delay,
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={`
        relative rounded-[2rem] border border-white/10 
        bg-gradient-to-br from-white/[0.03] to-white/[0.01]
        backdrop-blur-xl overflow-hidden
        ${className}
      `}
    >
      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/20 rounded-tr-lg" />
      </div>
      <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden pointer-events-none">
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-primary/20 rounded-bl-lg" />
      </div>

      {/* Subtle glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.05) 0%, transparent 50%)'
        }}
      />

      {children}
    </motion.div>
  );
}
