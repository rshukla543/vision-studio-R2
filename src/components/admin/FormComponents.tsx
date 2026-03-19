import { motion } from 'framer-motion';

interface FormGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}

export function AdminFormGrid({ children, cols = 2, className = '' }: FormGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <div className={`grid ${gridCols[cols]} gap-6 ${className}`}>
      {children}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function AdminFormField({ label, children, className = '', required = false }: FormFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`space-y-2 ${className}`}
    >
      <label className="text-xs font-medium tracking-wider uppercase text-white/50 flex items-center gap-1">
        {label}
        {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </motion.div>
  );
}

export const adminInputStyles = `
  w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 
  text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300
  focus:border-primary/50 focus:ring-1 focus:ring-primary/30 focus:bg-black/50
  hover:border-white/20
`;

export const adminTextAreaStyles = `
  ${adminInputStyles} resize-none leading-relaxed
  min-h-[120px]
`;

export const adminSelectStyles = `
  ${adminInputStyles} appearance-none cursor-pointer
  bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] 
  bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10
`;
