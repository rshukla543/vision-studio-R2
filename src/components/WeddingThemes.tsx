import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const themes = [
  {
    title: 'Ceremony',
    description: 'Sacred rituals, timeless traditions, and the essence of two souls becoming one.',
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path
          d="M50 5 A45 45 0 0 1 95 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
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
        <path
          d="M5 50 A45 45 0 0 1 95 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
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

export function WeddingThemes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 bg-gradient-to-b from-charcoal to-charcoal-deep"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div
          className={cn(
            'text-center mb-20 transition-all duration-1000',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-primary">
            Three Pillars of a Wedding Story
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-4">
            The Rhythm of <span className="italic text-primary">Celebration</span>
          </h2>
        </div>

        {/* Theme Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {themes.map((theme, index) => (
            <Link
              key={theme.title}
              to="/portfolio"
              className={cn(
                'group relative p-8 lg:p-12 border border-border/30 hover:border-primary/50 transition-all duration-700 bg-charcoal/50 backdrop-blur-sm',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Moon Phase Icon */}
              <div className="w-20 h-20 mx-auto mb-8 text-primary transition-transform duration-500 group-hover:scale-110">
                {theme.icon}
              </div>

              {/* Phase Label */}
              <span className="block text-center text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                {theme.phase}
              </span>

              {/* Title */}
              <h3 className="font-serif text-2xl text-center text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {theme.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-center text-muted-foreground leading-relaxed mb-8">
                {theme.description}
              </p>

              {/* CTA */}
              <div className="flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>View Gallery</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
