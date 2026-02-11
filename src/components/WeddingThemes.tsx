import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, cubicBezier } from 'framer-motion';

const EASE = cubicBezier(0.22, 1, 0.36, 1);

const themes = [
  {
    title: 'Ceremony',
    description: 'Sacred rituals, timeless traditions, and the essence of two souls becoming one.',
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M50 5 A45 45 0 0 1 95 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    phase: 'New Moon',
  },
  {
    title: 'Celebration',
    description: 'Joy, laughter, and the vibrant energy of families coming together in love.',
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.1" />
        <path d="M5 50 A45 45 0 0 1 95 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    phase: 'Half Moon',
  },
  {
    title: 'Details',
    description: 'The intricate beauty of jewelry, decor, and moments often unseen.',
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.15" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    phase: 'Full Moon',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.9,
      ease: EASE,
    },
  }),
};

export function WeddingThemes() {
  return (
    <section className="py-32 md:py-40 bg-gradient-to-b from-charcoal to-charcoal-deep">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: EASE }}
          className="text-center mb-20"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-primary">
            Three Pillars of a Wedding Story
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-4">
            The Rhythm of <span className="italic text-primary">Celebration</span>
          </h2>
        </motion.div>

        {/* Theme Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Link
                to="/portfolio"
                className="group relative block p-8 lg:p-12 border border-border/30 hover:border-primary/50 transition-all duration-700 bg-charcoal/50 backdrop-blur-sm overflow-hidden"
              >
                {/* Moon Phase Icon */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="w-20 h-20 mx-auto mb-8 text-primary"
                >
                  {theme.icon}
                </motion.div>

                {/* Phase Label */}
                <span className="block text-center text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  {theme.phase}
                </span>

                {/* Title */}
                <h3 className="font-serif text-2xl text-center text-foreground mb-4 group-hover:text-primary transition-colors duration-500">
                  {theme.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-center text-muted-foreground leading-relaxed mb-8">
                  {theme.description}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span>View Gallery</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
