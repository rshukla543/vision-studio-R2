import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, Star, Crown } from 'lucide-react';

type SignatureContent = {
  tagline: string | null;
  title_line_1: string | null;
  title_highlight: string | null;
  description_1: string | null;
  description_2: string | null;
  stat_1_value: string | null;
  stat_1_label: string | null;
  stat_2_value: string | null;
  stat_2_label: string | null;
  stat_3_value: string | null;
  stat_3_label: string | null;
  image_url: string | null;
  preview_image_url?: string | null;
};

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

// Animated counter component
const AnimatedCounter = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value?.replace(/\D/g, '') || '0');

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: LUXURY_EASE }}
      className="block font-serif text-3xl md:text-5xl text-white leading-none"
    >
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {value}
          {suffix}
        </motion.span>
      ) : (
        "0"
      )}
    </motion.span>
  );
};

// Floating decorative elements
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute top-20 left-10 w-4 h-4"
      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    >
      <Sparkles className="w-full h-full text-primary/30" />
    </motion.div>
    <motion.div
      className="absolute bottom-40 left-20 w-3 h-3"
      animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <Star className="w-full h-full text-primary/20" />
    </motion.div>
    <motion.div
      className="absolute top-40 right-20 w-5 h-5"
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      <Crown className="w-full h-full text-primary/20" />
    </motion.div>
  </div>
);

export function SignatureStyle() {
  const [content, setContent] = useState<SignatureContent | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Mouse tracking for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 20
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 150,
    damping: 20
  });

  useEffect(() => {
    supabase.from('signature_style').select('*').limit(1).single()
      .then(({ data }) => {
        if (data) {
          setContent(data);
          setDataLoaded(true);
        }
      });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setMousePosition({ x: 0, y: 0 });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: LUXURY_EASE }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 1.5, ease: LUXURY_EASE }
    }
  };

  const Stats = () => (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5"
    >
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="text-center lg:text-left group relative"
          whileHover={{ 
            scale: 1.08, 
            y: -8,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
        >
          {/* Gold glow background on hover */}
          <div className="absolute inset-0 -m-4 rounded-xl bg-primary/0 group-hover:bg-primary/10 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
          <div className="relative z-10">
            <motion.span
              className="block font-serif text-3xl md:text-5xl text-white leading-none group-hover:text-primary transition-colors duration-300"
            >
              {content?.[`stat_${i}_value` as keyof SignatureContent] || '0'}
              <span className="text-primary">+</span>
            </motion.span>
            <motion.span
              className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-bold mt-2 block group-hover:text-primary transition-colors duration-300"
            >
              {content?.[`stat_${i}_label` as keyof SignatureContent]}
            </motion.span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-40 bg-[#050505] text-white overflow-hidden font-sans"
    >
      <FloatingElements />

      {/* Animated background gradients */}
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full pointer-events-none"
        animate={{
          x: [-50, 50, -50],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"
        animate={{
          x: [50, -50, 50],
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">

          {/* TEXT SECTION */}
          <motion.div
            ref={sectionRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:w-1/2 order-1 lg:order-1"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-4 mb-6"
            >
              <motion.span
                className="h-px w-10 bg-gradient-to-r from-transparent via-primary/60 to-primary/20"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, ease: LUXURY_EASE, delay: 0.5 }}
              />
              <motion.span
                className="text-primary text-[10px] font-bold uppercase tracking-[0.6em] text-center"
                whileHover={{ scale: 1.05, letterSpacing: "0.65em" }}
              >
                {content?.tagline}
              </motion.span>
              <motion.span
                className="h-px w-10 bg-gradient-to-l from-transparent via-primary/60 to-primary/20"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, ease: LUXURY_EASE, delay: 0.5 }}
              />
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] text-center lg:text-left"
            >
              {content?.title_line_1}
              <motion.span
                className="block italic text-primary mt-1"
                animate={isInView ? {
                  textShadow: [
                    "0 0 30px rgba(212,175,55,0)",
                    "0 0 50px rgba(212,175,55,0.4)",
                    "0 0 30px rgba(212,175,55,0)"
                  ]
                } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {content?.title_highlight}
              </motion.span>
            </motion.h2>

            <motion.div variants={itemVariants} className="mt-6 space-y-4 max-w-lg mx-auto lg:mx-0">
              <motion.p
                className="text-base md:text-lg text-white/60 leading-relaxed font-light"
                whileHover={{ color: "rgba(255,255,255,0.85)", x: 5 }}
                transition={{ duration: 0.3 }}
              >
                {content?.description_1}
              </motion.p>
              <motion.div
                className="relative pl-6 border-l-2 border-primary/20"
                whileHover={{ x: 10, borderColor: "rgba(212,175,55,0.5)" }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-primary leading-relaxed italic text-left mx-auto lg:mx-0">
                  {content?.description_2}
                </p>
              </motion.div>
            </motion.div>

            <div className="mt-10">
              <Stats />
            </div>
          </motion.div>

          {/* IMAGE SECTION with 3D tilt */}
          <motion.div
            ref={imageRef}
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:w-1/2 flex justify-center lg:justify-start order-1 lg:order-2"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-72 h-96 md:w-[500px] md:h-[580px] select-none">

              {/* Animated rings behind image */}
              <motion.div
                className="absolute -inset-4 rounded-[3rem] border border-primary/10"
                animate={{ scale: [1, 1.02, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -inset-8 rounded-[3.5rem] border border-primary/5"
                animate={{ scale: [1.02, 1, 1.02], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />

              <motion.div
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => setIsTapped(!isTapped)}
                animate={{ scale: isTapped ? 1.03 : 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.8, ease: LUXURY_EASE }}
                className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] bg-[#111] z-20"
                style={{
                  rotateX,
                  rotateY,
                  transformPerspective: 1200,
                }}
              >
                {/* Dynamic shine effect */}
                <motion.div
                  className="absolute inset-0 z-30 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${50 + mousePosition.x * 50}% ${50 + mousePosition.y * 50}%, rgba(212,175,55,0.12) 0%, transparent 50%)`,
                  }}
                />

                <img
                  src={content?.image_url || ''}
                  draggable={false}
                  className="w-full h-full object-cover transition-all duration-1000 ease-out"
                  alt="Signature style portrait"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                {/* Corner accents */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
              </motion.div>

              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-6 -right-6 text-primary/40"
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={36} />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-md"
                animate={{ y: [-8, 8, -8], scale: [1, 1.1, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
