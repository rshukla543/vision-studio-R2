import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, cubicBezier } from 'framer-motion';

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
};

const EASE = cubicBezier(0.22, 1, 0.36, 1);

export function SignatureStyle() {
  const [content, setContent] = useState<SignatureContent | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);

  /* -----------------------------
     Fetch content
  ------------------------------ */
  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('signature_style')
        .select('*')
        .limit(1);

      if (!error && data?.length && mounted) {
        setContent(data[0]);
        // allow animation ONLY after data is ready
        requestAnimationFrame(() => setCanAnimate(true));
      }
    };

    fetchContent();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    // <section className="relative py-32 min-h-screen overflow-x-hidden bg-[#0a0a0a]">
    <section className="relative py-32 overflow-x-hidden bg-[#0a0a0a]">
      {/* Background Noise (keep for now) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* ---------------- TEXT COLUMN ---------------- */}
          <motion.div
            initial={{ opacity: 0, x: -48 }}
            whileInView={content ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE }}
            className="mb-20 space-y-10"
          >
            {content ? (
              <>
                <div className="space-y-4">
                  <span className="text-[10px] tracking-[0.5em] uppercase text-primary font-bold inline-block border-b border-primary/20 pb-2">
                    {content.tagline}
                  </span>

                  <h2 className="font-serif text-5xl md:text-7xl font-light text-white leading-[1.1]">
                    {content.title_line_1}
                    <span className="block italic text-primary/80 mt-2">
                      {content.title_highlight}
                    </span>
                  </h2>
                </div>

                <div className="space-y-6 max-w-lg">
                  <p className="text-lg text-white/50 leading-relaxed font-light">
                    {content.description_1}
                  </p>
                  <p className="text-white/30 leading-relaxed text-sm italic border-l border-primary/20 pl-6">
                    {content.description_2}
                  </p>
                </div>

                <div className="flex items-center gap-12 pt-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-1">
                      <span className="block font-serif text-4xl text-white">
                        {content[`stat_${i}_value` as keyof SignatureContent]}
                      </span>
                      <span className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-medium">
                        {content[`stat_${i}_label` as keyof SignatureContent]}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Skeleton (NO animation tied to reveal) */
              <div className="space-y-8">
                <div className="h-3 w-32 bg-white/5 rounded" />
                <div className="h-16 w-full bg-white/5 rounded" />
                <div className="h-32 w-full bg-white/5 rounded" />
              </div>
            )}
          </motion.div>

          {/* ---------------- IMAGE COLUMN ---------------- */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            whileInView={content ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            className="text-center mb-20"
          >
            <div className="relative w-[440px] h-[440px] md:w-[540px] md:h-[540px] flex items-center justify-center mx-auto">
              <div className="absolute w-full h-full border border-white/[0.03] rounded-full" />

              <div className="relative w-80 h-80 md:w-[440px] md:h-[440px] rounded-full overflow-hidden">
                {content ? (
                  <img
                    src={content.image_url || ''}
                    alt="Signature Style"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-60" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
