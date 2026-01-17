import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";

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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const glowY = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  useEffect(() => {
    supabase
      .from("about_content")
      .select("*")
      .eq("singleton_key", 1)
      .single()
      .then(({ data }) => data && setContent(data));
  }, []);

  const LUXURY_EASE = cubicBezier(0.19, 1, 0.22, 1);

  return (
    <section
      ref={sectionRef}
      className="relative pt-32 pb-20 md:pt-48 md:pb-30 bg-[#0a0a0a] overflow-hidden"
    >
     

      {/* 2. BACKGROUND GLOW - Softened & Deepened */}
      <motion.div
        style={{ y: glowY }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[160px] rounded-full -mr-64 -mt-32 pointer-events-none opacity-40"
      />

      <div className="container mx-auto px-6 relative z-10">

        {/* MOBILE QUOTE - Unique Reveal */}
        <div className="block md:hidden mb-24">
          <motion.blockquote
            initial={{ opacity: 0, letterSpacing: "-0.05em" }}
            whileInView={{ opacity: 1, letterSpacing: "0em" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 2, ease: LUXURY_EASE }}
            className="max-w-4xl mx-auto font-serif text-3xl md:text-4xl italic text-white/70 text-center leading-relaxed"
          >
            “{content?.quote_text}”
          </motion.blockquote>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">

          {/* 3. THE "LENS" FRAME - Longer, Smoother Animation */}
          <div className="relative w-full aspect-square max-w-[420px] md:max-w-[550px] mx-auto lg:mx-0 order-1 flex items-center justify-center">

            {/* Geometric Outer Rings */}
            <div className="absolute inset-0 border border-primary/5 rounded-full scale-[1.1]" />
            <div className="absolute inset-0 border border-white/5 rounded-full scale-[1.18]" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, ease: LUXURY_EASE }}
              className="relative z-10 w-[92%] h-[92%] rounded-full overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,1)] bg-[#111]"
            >
              {content?.portrait_image_url && (
                <img
                  src={content.portrait_image_url}
                  onLoad={() => setHiLoaded(true)}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-[3000ms] ease-out",
                    hiLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
                  )}
                  alt="Artist Portrait"
                />
              )}
              {/* Cinematic Vignette */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/10" />
            </motion.div>

            {/* EST Badge */}
            <motion.div
              initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
              whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 1.5, ease: LUXURY_EASE }}
              className="absolute bottom-[8%] right-[8%] bg-primary text-black h-20 w-20 md:h-24 md:w-24 rounded-full flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-20 border-8 border-[#0a0a0a]"
            >
              <span className="text-[10px] font-bold tracking-[0.2em] leading-none mb-1">EST.</span>
              <span className="text-xl md:text-2xl font-serif font-bold italic">{content?.experience_years?.split(' ')[0]}</span>
            </motion.div>
          </div>

          {/* 4. CONTENT BLOCK - Intersection Staggered Animation */}
          <div className="space-y-12 text-center lg:text-left order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: LUXURY_EASE }}
              className="space-y-6"
            >
              <span className="inline-block text-[11px] tracking-[0.8em] uppercase text-primary font-bold opacity-70">
                {content?.eyebrow_text}
              </span>

              <h2 className="font-serif text-5xl md:text-8xl font-light leading-none text-white tracking-tight">
                {content?.headline}
                <span className="block italic text-primary mt-4 font-normal tracking-normal">
                  {content?.highlighted_word}
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3, ease: LUXURY_EASE }}
              className="space-y-10 max-w-xl mx-auto lg:mx-0"
            >
              <p className="text-lg md:text-xl leading-relaxed text-white/40 font-light font-sans">
                {content?.body_paragraph_1}
              </p>
              <div className="flex items-center gap-6 justify-center lg:justify-start group">
                <div className="h-[1px] w-12 bg-primary/40 group-hover:w-20 transition-all duration-700" />
                <p className="text-sm tracking-wide text-white/30 italic">
                  {content?.body_paragraph_2}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.6, ease: LUXURY_EASE }}
              className="relative pt-12 mt-10 max-w-sm mx-auto lg:mx-0"
            >
              {/* Elegant Top Divider with a glowing center */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:via-primary/20 lg:to-transparent" />

              <div className="grid grid-cols-2 gap-12 relative">

                {/* First Stat: Weddings */}
                <div className="relative group">
                  <div className="space-y-1">
                    <span className="block font-serif text-5xl md:text-6xl text-white tracking-tighter transition-transform duration-700 group-hover:-translate-y-1">
                      {content?.weddings_count}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-px w-4 bg-primary/40" />
                      <span className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-semibold italic">
                        {content?.weddings_label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vertical Subtle Divider */}
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-px h-12 bg-white/5 hidden sm:block" />

                {/* Second Stat: Experience */}
                <div className="relative group pl-4">
                  <div className="space-y-1">
                    <span className="block font-serif text-5xl md:text-6xl text-white tracking-tighter transition-transform duration-700 group-hover:-translate-y-1">
                      {content?.experience_years}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-px w-4 bg-primary/40" />
                      <span className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-semibold italic">
                        {content?.experience_label}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>

        {/* 5. DESKTOP QUOTE - The Grand Reveal */}
        <div className="hidden md:block mt-56 border-t border-white/5 pt-24">
          <motion.blockquote
            initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: LUXURY_EASE }}
            className="max-w-4xl mx-auto font-serif text-3xl md:text-4xl italic text-white/70 text-center leading-relaxed"
          >
            “{content?.quote_text}”
          </motion.blockquote>
        </div>

      </div>
    </section>
  );
}
