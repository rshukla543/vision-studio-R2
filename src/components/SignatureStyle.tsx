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

  const imageRef = useRef(null);
  const isImageInView = useInView(imageRef, { once: true, margin: '-20% 0px' });

  /* ---------------- STATS BLOCK (REUSED) ---------------- */
  const Stats = ({ mobile = false }) => (
    <motion.div
      className={cn(
        "pt-10 border-t border-white/5",
        mobile ? "lg:hidden" : "hidden lg:block"
      )}
    >
      <div className="grid grid-cols-3 gap-4 text-center">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <span className="block font-serif text-3xl text-white">
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

          {/* ---------- TEXT ---------- */}
          <div className="order-1 w-full text-center lg:text-left">
            {content && (
              <>
                <span className="text-[10px] tracking-[0.5em] uppercase text-primary">
                  {content.tagline}
                </span>

                <h2 className="mt-6 font-serif text-5xl md:text-8xl text-white">
                  {content.title_line_1}
                  <span className="block italic text-primary">
                    {content.title_highlight}
                  </span>
                </h2>

                <p className="mt-6 text-white/50 max-w-lg mx-auto lg:mx-0">
                  {content.description_1}
                </p>

                {/* Desktop stats */}
                <Stats />
              </>
            )}
          </div>

          {/* ---------- IMAGE ---------- */}
          <motion.div
            ref={imageRef}
            className="order-2 w-full flex justify-center"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={isImageInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 3, ease: LUXURY_EASE }}
          >
            <div className="relative w-[280px] md:w-[520px] aspect-square">

              {/* GLOWING RINGS */}
              <div className="absolute inset-0 rounded-full border border-primary/30 shadow-[0_0_40px_rgba(212,175,55,0.25)]" />
              <div className="absolute inset-6 rounded-full border border-white/10" />
              <div className="absolute -inset-8 rounded-full border border-primary/10 blur-sm" />

              {/* ORBIT SHAPES */}
              <div className="absolute -top-6 left-1/2 w-2 h-2 bg-primary rounded-full blur-sm" />
              <div className="absolute bottom-8 -right-4 w-3 h-3 bg-primary/60 rounded-full blur-md" />

              {/* IMAGE */}
              <div className="absolute inset-10 rounded-full overflow-hidden border border-white/10">
                <img
                  src={content?.image_url || ''}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>
          </motion.div>

          {/* ---------- MOBILE STATS (BELOW IMAGE) ---------- */}
          <div className="order-3 w-full">
            <Stats mobile />
          </div>

        </div>
      </div>
    </section>
  );
}
