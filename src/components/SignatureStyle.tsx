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
    supabase.from('signature_style').select('*').limit(1).then(({ data }) => {
      if (data && mounted) setContent(data[0]);
    });
    return () => { mounted = false; };
  }, []);

  /* ---------------- ANIMATION VARIANTS ---------------- */
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.6, ease: LUXURY_EASE }
    }
  };

  const imageRef = useRef(null);
  const isImageInView = useInView(imageRef, { once: true, margin: '-20% 0px' });

  const Stats = ({ mobile = false }) => (
    <motion.div
      variants={itemVariants}
      className={cn(
        "pt-10 border-t border-white/5",
        mobile ? "lg:hidden" : "hidden lg:block"
      )}
    >
      <div className="grid grid-cols-3 gap-4 text-center lg:text-left">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <span className="block font-serif text-3xl md:text-5xl text-white">
              {content?.[`stat_${i}_value` as keyof SignatureContent]}
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-primary/50">
              {content?.[`stat_${i}_label` as keyof SignatureContent]}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <section className="relative py-20 md:py-40 bg-[#0a0a0a] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">

          {/* ---------------- TEXT ---------------- */}
          <AnimatePresence>
            {content && (
              <motion.div
                className="order-1 w-full text-center lg:text-left"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.span variants={itemVariants}
                  className="text-[10px] tracking-[0.5em] uppercase text-primary border-b border-primary/20 pb-2 inline-block">
                  {content.tagline}
                </motion.span>

                <motion.h2 variants={itemVariants}
                  className="mt-8 font-serif text-5xl md:text-8xl text-white leading-tight">
                  {content.title_line_1}
                  <span className="block italic text-primary mt-2">
                    {content.title_highlight}
                  </span>
                </motion.h2>

                <motion.p variants={itemVariants}
                  className="mt-6 text-white/50 max-w-lg mx-auto lg:mx-0">
                  {content.description_1}
                </motion.p>

                <motion.p variants={itemVariants}
                  className="mt-6 text-white/30 text-sm italic border-l-2 border-primary/20 pl-6 max-w-lg mx-auto lg:mx-0">
                  {content.description_2}
                </motion.p>

                <div className="order-3 w-full">
                  <Stats />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------------- IMAGE ---------------- */}
          <motion.div
            ref={imageRef}
            className="order-2 w-full flex justify-center"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={isImageInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 3, ease: LUXURY_EASE }}
          >
            <div className="relative w-[280px] md:w-[520px] aspect-square">

              {/* Rings */}
              <div className="absolute inset-0 rounded-full border border-primary/30 shadow-[0_0_25px_rgba(212,175,55,0.25)]" />
              <div className="absolute inset-6 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.08)]" />
              <div className="absolute -inset-10 rounded-full border border-primary/10 blur-sm" />

              {/* Image */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.9, ease: LUXURY_EASE }}
                className="absolute inset-10 rounded-full overflow-hidden border border-white/10"
              >
                <img
                  src={content?.image_url || ''}
                  className="w-full h-full object-cover"
                  alt="Signature Style"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* ---------------- MOBILE STATS ---------------- */}
          <div className="order-3 w-full">
            <Stats mobile />
          </div>

        </div>
      </div>
    </section>
  );
}
