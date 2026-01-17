import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";

// ... (AboutContent type remains same)
type AboutContent = {
  eyebrow_text: string | null;
  headline: string | null;
  highlighted_word: string | null;
  body_paragraph_1: string | null;
  body_paragraph_2: string | null;
  weddings_label: string | null;
  weddings_count: string | null;
  experience_label: string | null;
  experience_years: string | null;
  quote_text: string | null;
  portrait_image_url: string | null;
  portrait_image_preview_url: string | null;
};
export function AboutSection() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [hiLoaded, setHiLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("about_content")
      .select("*")
      .eq("singleton_key", 1)
      .limit(1)
      .then(({ data }) => data && setContent(data[0]));
  }, []);
  const LUXURY_EASE = cubicBezier(0.19, 1, 0.22, 1);
//  transition: { duration: 1.2, ease: LUXURY_EASE } 
  const LUXURY_TRANSITION = { duration: 1.4, ease: LUXURY_EASE };

  return (
    <section ref={sectionRef} className="relative py-20 md:py-40 bg-[#0a0a0a] overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-32 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        
        {/* 1. MOBILE QUOTE (Top of page on mobile only) */}
        <div className="block md:hidden mb-16">
          <motion.blockquote 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-2xl italic text-white/80 text-center leading-relaxed"
          >
            “{content?.quote_text}”
          </motion.blockquote>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* 2. IMAGE BLOCK (Centered on Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -60, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={LUXURY_TRANSITION}
            className="relative w-full aspect-[4/5] max-w-[420px] md:max-w-[500px] mx-auto lg:mx-0 order-1 lg:order-1"
          >
            {/* The "Cool" Frame Enhancement */}
            <div className="absolute -inset-3 md:-inset-6 pointer-events-none z-0">
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-primary/5 blur-xl" />
              {/* Double Border Frame */}
              <div className="absolute inset-0 rounded-[2.5rem] border border-white/10" />
              <div className="absolute inset-2 rounded-[2.2rem] border border-primary/20" />
            </div>

            <div className="relative z-10 w-full h-full rounded-[2rem] overflow-hidden bg-[#111] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
              {content?.portrait_image_url && (
                <img
                  src={content.portrait_image_url}
                  onLoad={() => setHiLoaded(true)}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-1000 ease-out grayscale-[0.3] hover:grayscale-0 scale-110",
                    hiLoaded ? "opacity-100 scale-100" : "opacity-0"
                  )}
                  alt="Portrait"
                />
              )}
              {/* Elegant Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem]" />
            </div>

            {/* Floating Badge (Optional Cool Detail) */}
            <div className="absolute -bottom-4 -right-4 bg-primary text-black px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-xl z-20 hidden md:block">
              EST. {content?.experience_years?.split(' ')[0]}
            </div>
          </motion.div>

          {/* 3. TEXT BLOCK */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={LUXURY_TRANSITION}
            className="space-y-10 text-center lg:text-left order-2 lg:order-2"
          >
            <div className="space-y-6">
              <span className="inline-block text-[11px] tracking-[0.5em] uppercase text-primary font-bold border-b border-primary/30 pb-2">
                {content?.eyebrow_text}
              </span>

              <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-none text-white">
                {content?.headline}
                <span className="block italic text-primary mt-3 font-normal">{content?.highlighted_word}</span>
              </h2>
            </div>

            <div className="space-y-8 max-w-xl mx-auto lg:mx-0">
              <p className="text-base md:text-lg leading-relaxed text-white/50 font-light">
                {content?.body_paragraph_1}
              </p>
              <p className="text-sm leading-loose text-white/30 italic border-l-2 border-primary/20 pl-6 text-left">
                {content?.body_paragraph_2}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5 max-w-sm mx-auto lg:mx-0">
              <div className="space-y-1">
                <span className="block font-serif text-5xl text-white">{content?.weddings_count}</span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-primary/60 font-medium">{content?.weddings_label}</span>
              </div>
              <div className="space-y-1">
                <span className="block font-serif text-5xl text-white">{content?.experience_years}</span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-primary/60 font-medium">{content?.experience_label}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4. DESKTOP QUOTE (Bottom of page for desktop) */}
        <div className="hidden md:block mt-32 border-t border-white/5 pt-20">
          <motion.blockquote 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto font-serif text-3xl md:text-4xl italic text-white/70 text-center leading-relaxed"
          >
            “{content?.quote_text}”
          </motion.blockquote>
        </div>

      </div>
    </section>
  );
}
