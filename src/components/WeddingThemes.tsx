import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import moon1 from '@/assets/moon-1.svg';
import moon2 from '@/assets/moon-2.svg';
import moon3 from '@/assets/moon-3.svg';

const moonAssets = [moon1, moon2, moon3];

const defaultThemes = [
  {
    title: 'Ceremony',
    description:
      'Sacred rituals, timeless traditions, and the essence of two souls becoming one.',
    phase: 'New Moon',
  },
  {
    title: 'Celebration',
    description:
      'Joy, laughter, and the vibrant energy of families coming together in love.',
    phase: 'Half Moon',
  },
  {
    title: 'Details',
    description:
      'The intricate beauty of jewelry, decor, and moments often unseen.',
    phase: 'Full Moon',
  },
];

export function WeddingThemes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [content, setContent] = useState<any>(null);

  // 👇 Fetch from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('wedding_themes_content')
        .select('*')
        .eq('singleton_key', '1')
        .single();

      if (!error && data) {
        setContent(data);
      } else {
        console.error('Error fetching wedding themes:', error);
      }
    };

    fetchContent();
  }, []);

  // 👇 Intersection animation (unchanged)
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

  // 👇 Build dynamic themes array
  const themes = content
    ? [
        {
          title: content.theme1_title,
          description: content.theme1_description,
          phase: content.theme1_phase,
        },
        {
          title: content.theme2_title,
          description: content.theme2_description,
          phase: content.theme2_phase,
        },
        {
          title: content.theme3_title,
          description: content.theme3_description,
          phase: content.theme3_phase,
        },
      ]
    : defaultThemes;

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
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          )}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-primary">
            {content?.eyebrow_text || 'Three Pillars of a Wedding Story'}
          </span>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-4">
            {content?.heading_base || 'The Rhythm of'}{' '}
            <span className="italic text-primary">
              {content?.heading_highlight || 'Celebration'}
            </span>
          </h2>
        </div>

        {/* Theme Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {themes.map((theme, index) => {
            // Map theme to category
            const categoryMap: Record<string, string> = {
              'Ceremony': 'Wedding',
              'Celebration': 'Candid',
              'Details': 'Pre-Wedding'
            };
            const category = categoryMap[theme.title] || 'All';
            
            return (
              <Link
                key={index}
                to={`/portfolio?category=${encodeURIComponent(category)}`}
                className={cn(
                  'group relative p-8 lg:p-12 border border-border/30 hover:border-primary/50 transition-all duration-700 bg-charcoal/50 backdrop-blur-sm',
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative w-24 h-24 mx-auto mb-8 group">
                
                {/* 1. GLOW EFFECT LAYER (Invisible until hover) */}
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 scale-50 group-hover:scale-150" />

                {/* 2. EXISTING GEOMETRIC BACKGROUND */}
                <div className="relative w-full h-full text-primary transition-transform duration-700 group-hover:rotate-90 group-hover:scale-110">
                  {index === 0 && (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                      <path d="M50 5 A45 45 0 0 1 95 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}

                  {index === 1 && (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                      <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.1" />
                      <path d="M5 50 A45 45 0 0 1 95 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}

                  {index === 2 && (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                      <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.15" />
                      <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                    </svg>
                  )}
                </div>

                {/* 3. CENTERED MOON SVG (The sexy reveal) */}
                <div className="absolute inset-0 flex items-center justify-center p-5 z-10 pointer-events-none">
                  <img 
                    src={moonAssets[index]} 
                    alt={`Moon Phase ${index + 1}`}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(214,179,92,0.8)] transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(214,179,92,1)]"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                  />
                </div>
                
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
              <p className="text-sm text-center text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
                {theme.description}
              </p>

              {/* CTA */}
              <div className="flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>View Gallery</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
    </section>
  );
}





// import { Link } from 'react-router-dom';
// import { cn } from '@/lib/utils';
// import { motion, cubicBezier } from 'framer-motion';

// const EASE = cubicBezier(0.22, 1, 0.36, 1);

// const themes = [
//   {
//     title: 'Ceremony',
//     description: 'Sacred rituals, timeless traditions, and the essence of two souls becoming one.',
//     icon: (
//       <svg viewBox="0 0 100 100" className="w-full h-full">
//         <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
//         <path d="M50 5 A45 45 0 0 1 95 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       </svg>
//     ),
//     phase: 'New Moon',
//   },
//   {
//     title: 'Celebration',
//     description: 'Joy, laughter, and the vibrant energy of families coming together in love.',
//     icon: (
//       <svg viewBox="0 0 100 100" className="w-full h-full">
//         <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
//         <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.1" />
//         <path d="M5 50 A45 45 0 0 1 95 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       </svg>
//     ),
//     phase: 'Half Moon',
//   },
//   {
//     title: 'Details',
//     description: 'The intricate beauty of jewelry, decor, and moments often unseen.',
//     icon: (
//       <svg viewBox="0 0 100 100" className="w-full h-full">
//         <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
//         <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.15" />
//         <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
//       </svg>
//     ),
//     phase: 'Full Moon',
//   },
// ];

// const cardVariants = {
//   hidden: { opacity: 0, y: 60, scale: 0.95 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: {
//       delay: i * 0.15,
//       duration: 0.9,
//       ease: EASE,
//     },
//   }),
// };

// export function WeddingThemes() {
//   return (
//     <section className="py-32 md:py-40 bg-gradient-to-b from-charcoal to-charcoal-deep">
//       <div className="container mx-auto px-6">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ duration: 1, ease: EASE }}
//           className="text-center mb-20"
//         >
//           <span className="text-xs tracking-[0.3em] uppercase text-primary">
//             Three Pillars of a Wedding Story
//           </span>
//           <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-4">
//             The Rhythm of <span className="italic text-primary">Celebration</span>
//           </h2>
//         </motion.div>

//         {/* Theme Cards */}
//         <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
//           {themes.map((theme, index) => (
//             <motion.div
//               key={theme.title}
//               custom={index}
//               variants={cardVariants}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true, amount: 0.2 }}
//             >
//               <Link
//                 to="/portfolio"
//                 className="group relative block p-8 lg:p-12 border border-border/30 hover:border-primary/50 transition-all duration-700 bg-charcoal/50 backdrop-blur-sm overflow-hidden"
//               >
//                 {/* Moon Phase Icon */}
//                 <motion.div
//                   whileHover={{ scale: 1.15, rotate: 10 }}
//                   transition={{ duration: 0.6, ease: EASE }}
//                   className="w-20 h-20 mx-auto mb-8 text-primary"
//                 >
//                   {theme.icon}
//                 </motion.div>

//                 {/* Phase Label */}
//                 <span className="block text-center text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
//                   {theme.phase}
//                 </span>

//                 {/* Title */}
//                 <h3 className="font-serif text-2xl text-center text-foreground mb-4 group-hover:text-primary transition-colors duration-500">
//                   {theme.title}
//                 </h3>

//                 {/* Description */}
//                 <p className="text-sm text-center text-muted-foreground leading-relaxed mb-8">
//                   {theme.description}
//                 </p>

//                 {/* CTA */}
//                 <div className="flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
//                   <span>View Gallery</span>
//                   <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                   </svg>
//                 </div>

//                 {/* Hover Glow */}
//                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
//                   <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
//                 </div>
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
