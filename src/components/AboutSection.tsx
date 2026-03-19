import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence, cubicBezier, useInView, useAnimation, scale } from "framer-motion";
import { Sparkles } from "lucide-react";

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

const EASE = cubicBezier(0.12, 1, 0.22, 1);

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60, rotateY: -15 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 1.2, ease: EASE },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE },
  },
};

const quoteContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

// const quoteWord = {
//   hidden: { opacity: 0, y: 30, scale: 0.8 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { 
//       type: "spring" as const,
//       stiffness: 200,
//       damping: 12,
//       mass: 0.8
//     },
//   },
// };
const quoteWord = {
  hidden: {
    opacity: 0,
    y: 30,
    // scale: 0.5,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    // scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: EASE,
    },
  },
};
// Floating particles component for ambient effect
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            x: [-8, 8, -8],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
};

export function AboutSection() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [hiLoaded, setHiLoaded] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const quoteRef = useRef(null);
  const isQuoteInView = useInView(quoteRef, { margin: "-15% 0px -15% 0px" });
  const quoteControls = useAnimation();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsTouchDevice(mq.matches);
  }, []);

  useEffect(() => {
    supabase
      .from("about_content")
      .select("*")
      .eq("singleton_key", 1)
      .single()
      .then(({ data }) => data && setContent(data));
  }, []);

  useEffect(() => {
    quoteControls.start(isQuoteInView ? "visible" : "hidden");
  }, [isQuoteInView, quoteControls]);

  return (
    // <section className="relative py-24 md:py-40 bg-charcoal-deep text-foreground overflow-hidden font-sans">
    <section className="relative py-24 md:py-40 bg-gradient-to-b from-[#050505] via-[#0a0805] to-[#050505] text-foreground overflow-hidden font-sans">
      {/* Enhanced Golden Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 blur-[150px] rounded-full -mr-32 -mt-32 pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full -ml-20 -mb-20 pointer-events-none opacity-40" />
      
      {/* Subtle gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      
      {/* Floating Particles */}
      <FloatingParticles />

      <div className="container mx-auto px-6 relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1, ease: EASE }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.span 
              className="h-px w-8 bg-gradient-to-r from-transparent via-primary/40 to-primary/60" 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
            />
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.6em]">
              {content?.eyebrow_text || "The Artisans"}
            </span>
            <motion.span 
              className="h-px w-8 bg-gradient-to-l from-transparent via-primary/40 to-primary/60" 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
            />
          </div>
          <h2 className="font-serif text-6xl md:text-8xl font-light tracking-tight">
            The <span className="italic font-normal text-foreground">Legacy</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">

          {/* 1. PORTRAIT FRAME */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="lg:w-1/2 flex justify-center lg:justify-end relative group"
          >
            <div className="relative w-72 h-96 md:w-[460px] md:h-[580px] select-none">

              {/* Anti-Download Overlay */}
              <div
              // className="absolute inset-0 z-30 cursor-none" 
                className="absolute inset-0 z-30 "
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => setIsTapped(!isTapped)}
              />

              {/* Image with hover/tap zoom */}
              
              <motion.div
                className="relative w-full h-full rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl bg-charcoal z-20 transition-transform duration-700 group-hover:scale-105"
              >
                            
              {/* <motion.div
                animate={{ scale: isTapped ? 1.05 : 1 }}
                whileHover={{ scale: 1.045 }}
                whileTap={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="relative w-full h-full rounded-[1.5rem] overflow-hidden  border border-white/10 shadow-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] bg-charcoal z-20 group transition-transform duration-700 group-hover:scale-105 "
                // className="relative w-full h-full rounded-[1.5rem] overflow-hidden  border border-white/10 shadow-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] bg-charcoal z-20 group "
              > */}


                {/* Tapered border frame using gradient masks */}
                 {/* <div className="absolute inset-0 z-10 pointer-events-none rounded-[1.5rem]"
                  style={{
                    border: '1px solid transparent',
                    borderImage: 'linear-gradient(to bottom, hsl(43 59% 52% / 0.3), transparent 40%, transparent 60%, hsl(43 59% 52% / 0.3)) 1',
                  }}
                />  */}

                {/* Hover glow */}
                <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent blur-2xl" />
                </div>

                <AnimatePresence>
                  {!hiLoaded && content?.portrait_image_preview_url && (
                    <motion.img
                      src={content.portrait_image_preview_url}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full object-cover blur-xl"
                    />
                  )}
                </AnimatePresence>

                {content?.portrait_image_url && (
                  <img
                    src={content.portrait_image_url}
                    onLoad={() => setHiLoaded(true)}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-[1200ms] ease-out select-none pointer-events-none",
                      hiLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    )}
                    alt="Portrait"
                  />
                )}

                {/* Cinematic fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </motion.div>

              {/* EST. BADGE */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
                animate={{
                  y: [-5, 5, -5],
                }}
                className="absolute -top-5 -right-5 bg-gradient-to-br from-primary to-amber-600 text-primary-foreground h-20 w-20 md:h-24 md:w-24 rounded-full flex flex-col items-center justify-center z-40 shadow-[0_0_40px_rgba(212,175,55,0.3)]"
                style={{
                  transition: "transform 0.3s ease-out",
                }}
              >
                <span className="text-[8px] font-bold tracking-[0.2em] leading-none uppercase">Est.</span>
                <span className="text-xl md:text-2xl font-serif font-bold italic">{content?.experience_years?.split(' ')[0]}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* 2. CONTENT BLOCK — staggered reveal */}
          <motion.div
            className="lg:w-1/2 space-y-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div variants={fadeUp} className="space-y-8">
              <h2 className="font-serif text-5xl md:text-7xl leading-[1.1] tracking-tight text-foreground/95">
                {content?.headline}
                <span className="block italic text-primary mt-3">
                  {content?.highlighted_word}
                </span>
              </h2>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-8 max-w-xl">
              <p className="text-base md:text-lg leading-relaxed text-foreground/50 font-light">
                {content?.body_paragraph_1}
              </p>
              <div className="flex items-center gap-4 text-primary italic text-sm border-l border-primary/20 pl-6">
              {/* <div className="flex items-center gap-4 text-primary/60 italic text-sm border-l border-primary/20 pl-6"> */}
                <p>{content?.body_paragraph_2}</p>
              </div>
            </motion.div>

            {/* STATS */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-2 gap-12 pt-12 border-t border-border/30 group"
            >
              <div className="space-y-1 transform transition-all duration-700 ease-out hover:scale-110 hover:-translate-y-1">
                <span className="block font-serif text-4xl md:text-6xl text-foreground">
                  {content?.weddings_count}
                </span>
                <span className="text-[9px] tracking-[0.4em] uppercase text-foreground/30 font-bold">
                  {content?.weddings_label}
                </span>
              </div>

              <div className="space-y-1 transform transition-all duration-700 ease-out hover:scale-110 hover:-translate-y-1">
                <span className="block font-serif text-4xl md:text-6xl text-foreground">
                  {content?.experience_years}
                </span>
                <span className="text-[9px] tracking-[0.4em] uppercase text-foreground/30 font-bold">
                  {content?.experience_label}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3. BOTTOM QUOTE */}
        <motion.div
          ref={quoteRef}
          variants={quoteContainer}
          initial="hidden"
          animate={quoteControls}
          className="lg:mt-40 pt-20 border-t border-border/20 z-50"
        >
          <blockquote className="max-w-5xl mx-auto text-center flex flex-wrap justify-center gap-x-[0.6em] gap-y-3 overflow-hidden px-4">
            {content?.quote_text?.split(" ").map((word, idx) => (
              <motion.span
                variants={quoteWord}
                className="font-serif text-3xl md:text-5xl italic leading-tight inline-block whitespace-nowrap 
                 bg-gradient-to-b from-[#FDE68A] via-[#D4AF37] to-[#7C6621] 
                 bg-clip-text text-transparent 
                 drop-shadow-[0_2px_15px_rgba(212,175,55,0.4)]"
                 >
   
                {word}
              </motion.span>
              // <motion.span
              //   key={idx}
              //   variants={quoteWord}
              //   className="font-serif text-3xl md:text-5xl italic text-primary drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]"
              // >
              //   {word}
              // </motion.span>
            ))}
          </blockquote>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={quoteControls}
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { opacity: 1, scaleX: 1, transition: { delay: 0.5, duration: 1.2, ease: EASE } }
            }}
            className="relative mx-auto mt-16 h-px w-52 origin-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <div className="absolute inset-0 blur-md bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-70" />
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}





           //   className="
              //     font-serif text-3xl md:text-5xl italic leading-tight inline-block

              //     bg-[linear-gradient(110deg,#fff6cc,#d4af37_40%,#fff6cc_50%,#b8962e_60%,#d4af37)]
              //     bg-[length:200%_100%]
              //     bg-clip-text text-transparent

              //     drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]
              //   "
              // >