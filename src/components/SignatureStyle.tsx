import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence, cubicBezier, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

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

const LUXURY_EASE = cubicBezier(0.16, 1, 0.3, 1);

export function SignatureStyle() {
  const [content, setContent] = useState<SignatureContent | null>(null);
  const [hiResLoaded, setHiResLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('signature_style')
        .select('*')
        .limit(1);

      if (!error && data?.length && mounted) {
        setContent(data[0]);
      }
    };
    fetchContent();
    return () => { mounted = false; };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.35,
        ease: LUXURY_EASE
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.6, ease: LUXURY_EASE }
    }
  };

  const imageRef = useRef(null);
  const isImageInView = useInView(imageRef, {
    once: true,
    margin: '-15% 0px',
  });

  return (
    <section className="relative py-20 md:py-40 overflow-hidden bg-[#0a0a0a]">
      <div className="hidden md:block absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* IMAGE COLUMN */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={isImageInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 3.0, ease: LUXURY_EASE }}
            className="order-last lg:order-last w-full"
          >
            <div className="relative aspect-square max-w-[300px] md:max-w-[520px] flex items-center justify-center mx-auto">
              <div className="absolute w-full h-full border border-white/[0.05] rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-[92%] h-[92%] border border-primary/10 rounded-full" />

              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.9, ease: LUXURY_EASE }}
                className="relative w-[84%] h-[84%] rounded-full overflow-hidden bg-[#111] border border-white/10 shadow-2xl cursor-pointer"
              >
                {content?.image_url && (
                  <>
                    <img
                      src={content.preview_image_url || content.image_url}
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover blur-md transition-opacity duration-1000",
                        hiResLoaded ? "opacity-0" : "opacity-100"
                      )}
                      alt=""
                    />
                    <img
                      src={content.image_url}
                      onLoad={() => setHiResLoaded(true)}
                      decoding="async"
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-all duration-1000 will-change-transform",
                        hiResLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
                      )}
                      alt="Signature Style"
                    />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
              </motion.div>
            </div>
          </motion.div>

          {/* MOBILE STATS (below image) */}
          {content && (
            <div className="md:hidden w-full pt-12">
              <div className="flex justify-between gap-4 border-t border-white/5 pt-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <span className="block font-serif text-3xl text-white">
                      {content[`stat_${i}_value` as keyof SignatureContent]}
                    </span>
                    <span className="text-[8px] tracking-[0.2em] uppercase text-primary/50">
                      {content[`stat_${i}_label` as keyof SignatureContent]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEXT COLUMN */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {content ? (
                <motion.div
                  key="main-content"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="space-y-10 text-center lg:text-left will-change-transform"
                >
                  <motion.div variants={itemVariants}>
                    <span className="text-[10px] tracking-[0.5em] md:tracking-[0.8em] uppercase text-primary font-bold inline-block border-b border-primary/20 pb-2">
                      {content.tagline}
                    </span>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <h2 className="font-serif text-5xl md:text-8xl font-light text-white leading-[1.1] tracking-tight">
                      {content.title_line_1}
                      <span className="block italic text-primary mt-2">
                        {content.title_highlight}
                      </span>
                    </h2>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6 max-w-lg mx-auto lg:mx-0">
                    <p className="text-base md:text-xl text-white/50 leading-relaxed font-light">
                      {content.description_1}
                    </p>
                    <p className="text-white/30 text-sm italic border-l-2 border-primary/20 pl-6 text-left mx-auto lg:mx-0">
                      {content.description_2}
                    </p>
                  </motion.div>

                  {/* DESKTOP STATS */}
                  <div className="hidden md:block pt-10 border-t border-white/5">
                    <div className="grid grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="text-left group">
                          <span className="block font-serif text-5xl text-white group-hover:text-primary transition-colors">
                            {content[`stat_${i}_value` as keyof SignatureContent]}
                          </span>
                          <span className="text-[10px] tracking-[0.2em] uppercase text-primary/50">
                            {content[`stat_${i}_label` as keyof SignatureContent]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
