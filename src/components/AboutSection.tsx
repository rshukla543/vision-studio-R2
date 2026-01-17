import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { motion, cubicBezier } from "framer-motion";

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
  const LUXURY_EASE = cubicBezier(0.19, 1, 0.22, 1);

  useEffect(() => {
    supabase
      .from("about_content")
      .select("*")
      .eq("singleton_key", 1)
      .single()
      .then(({ data }) => data && setContent(data));
  }, []);

  return (
    <section className="relative pt-24 pb-20 md:pt-40 md:pb-24 bg-[#0a0a0a] overflow-hidden">
      {/* Subtle Static Background Detail */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* MOBILE QUOTE */}
        <div className="block md:hidden mb-16">
          <motion.blockquote
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: LUXURY_EASE }}
            className="font-serif text-2xl italic text-white/60 text-left leading-relaxed border-l-2 border-primary/30 pl-4"
          >
            “{content?.quote_text}”
          </motion.blockquote>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">

          {/* 1. PORTRAIT FRAME WITH HOVER ZOOM */}
          <div className="relative w-full aspect-square max-w-[400px] md:max-w-[550px] mx-auto lg:mx-0 order-1 flex items-center justify-center group cursor-crosshair">
            <div className="absolute inset-0 border border-primary/10 rounded-full scale-[1.05]" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: LUXURY_EASE }}
              className="relative z-10 w-[94%] h-[94%] rounded-full overflow-hidden bg-[#111] shadow-2xl shadow-black"
            >
              {/* Progressive Loading */}
              {content?.portrait_image_preview_url && !hiLoaded && (
                <img
                  src={content.portrait_image_preview_url}
                  className="absolute inset-0 w-full h-full object-cover blur-md"
                  alt="loading..."
                />
              )}
              
              {content?.portrait_image_url && (
                <img
                  src={content.portrait_image_url}
                  onLoad={() => setHiLoaded(true)}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-1000 ease-out",
                    hiLoaded ? "opacity-100" : "opacity-0",
                    "group-hover:scale-110" // HOVER ZOOM ACTION
                  )}
                  alt="Artist Portrait"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
            </motion.div>

            {/* EST Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8, ease: LUXURY_EASE }}
              className="absolute bottom-[10%] right-[10%] bg-primary text-black h-20 w-20 md:h-24 md:w-24 rounded-full flex flex-col items-center justify-center z-20 border-[6px] border-[#0a0a0a]"
            >
              <span className="text-[9px] font-bold tracking-widest leading-none mb-1">EST.</span>
              <span className="text-xl md:text-2xl font-serif font-bold italic">{content?.experience_years?.split(' ')[0]}</span>
            </motion.div>
          </div>

          {/* CONTENT BLOCK */}
          <div className="space-y-10 text-left order-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: LUXURY_EASE }}
              className="space-y-4"
            >
              <span className="inline-block text-[10px] tracking-[0.6em] uppercase text-primary font-bold">
                {content?.eyebrow_text}
              </span>
              <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] text-white">
                {content?.headline}
                <span className="block italic text-primary mt-2">
                  {content?.highlighted_word}
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="space-y-8 max-w-xl"
            >
              <p className="text-base md:text-lg leading-relaxed text-white/50 font-light">
                {content?.body_paragraph_1}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-primary/40" />
                <p className="text-sm text-white/40 italic">
                  {content?.body_paragraph_2}
                </p>
              </div>
            </motion.div>
            {/* 2. STATS SECTION - CENTERED & SPACED */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="pt-10 mt-6 border-t border-white/5"
            >
              {/* <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:via-primary/20 lg:to-transparent" /> */}
              <div className="flex justify-around items-center max-w-md mx-auto lg:mx-0">
                <div className="text-center space-y-1">
                  <span className="block font-serif text-5xl md:text-6xl text-white">
                    {content?.weddings_count}
                  </span>
                  <span className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-semibold italic">
                    {content?.weddings_label}
                  </span>
                </div>

                {/* Vertical Divider */}
                <div className="h-12 w-px bg-white/10 mx-4" />

                <div className="text-center space-y-1">
                  <span className="block font-serif text-5xl md:text-6xl text-white">
                    {content?.experience_years}
                  </span>
                  <span className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-semibold italic">
                    {content?.experience_label}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 3. DESKTOP QUOTE - TIGHTENED DISTANCE */}
        <div className="hidden md:block mt-32 border-t border-white/5 pt-16">
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
            className="max-w-4xl mx-auto font-serif text-4xl italic text-white/60 text-center leading-relaxed"
          >
            “{content?.quote_text}”
          </motion.blockquote>
        </div>

      </div>
    </section>
  );
}
