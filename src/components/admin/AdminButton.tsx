import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface AdminButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

export function AdminButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = ''
}: AdminButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 overflow-hidden group';
  
  const variants = {
    primary: `
      bg-primary text-black
      hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]
      active:scale-[0.98]
    `,
    secondary: `
      bg-white/5 text-white border border-white/10
      hover:bg-white/10 hover:border-primary/30
      hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]
      active:scale-[0.98]
    `,
    danger: `
      bg-red-500/10 text-red-400 border border-red-500/20
      hover:bg-red-500/20 hover:border-red-500/40
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-white/60
      hover:text-white hover:bg-white/5
      active:scale-[0.98]
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-xl',
    md: 'px-6 py-3 text-sm rounded-2xl',
    lg: 'px-8 py-4 text-base rounded-2xl'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Glow effect overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, rgba(212,175,55,0.2) 0%, transparent 70%)'
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </span>
    </motion.button>
  );
}
