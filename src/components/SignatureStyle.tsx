import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, cubicBezier, AnimatePresence } from 'framer-motion';

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

const SMOOTH_EASE = cubicBezier(0.43, 0.13, 0.23, 0.96);

export function SignatureStyle() {
  const [content, setContent] = useState<SignatureContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('signature_style')
          .select('*')
          .limit(1);

        if (!error && data?.length && mounted) {
          setContent(data[0]);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchContent();
    return () => { mounted = false; };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1, ease: SMOOTH_EASE }
    }
  };

  return (
    <section className="relative py-24 md:py-40 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* IMAGE COLUMN */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: SMOOTH_EASE }}
            className="order-first lg:order-last w-full"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square max-w-[280px] md:max-w-[500px] flex items-center justify-center mx-auto"
            >
              <div className="absolute w-full h-full border border-white/[0.07] rounded-full" />
              <div className="relative w-[85%] h-[85%] rounded-full overflow-hidden border border-white/10">
                {content?.image_url ? (
                  <img src={content.image_url} alt="Signature" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* TEXT COLUMN */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {content ? (
                <motion.div
                  key="content"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }} // Lowered for mobile trigger
                  className="space-y-10 text-center lg:text-left"
                >
                  <motion.div variants={itemVariants} className="space-y-4">
                    <span className="text-[10px] tracking-[0.5em] md:tracking-[0.8em] uppercase text-primary font-bold inline-block border-b border-primary/30 pb-2">
                      {content.tagline}
                    </span>
                    <h2 className="font-serif text-5xl md:text-8xl font-light text-white leading-[1.1] tracking-tight">
                      {content.title_line_1}
                      <span className="block italic text-primary/90 mt-2 tracking-normal">
                        {content.title_highlight}
                      </span>
                    </h2>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6 max-w-lg mx-auto lg:mx-0">
                    <p className="text-base md:text-xl text-white/50 leading-relaxed font-light">
                      {content.description_1}
                    </p>
                    <p className="text-white/30 leading-relaxed text-sm italic border-l-2 border-primary/20 pl-6 text-left mx-auto lg:mx-0">
                      {content.description_2}
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 md:gap-12 pt-8 border-t border-white/5">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <span className="block font-serif text-3xl md:text-5xl text-white">
                          {content[`stat_${i}_value` as keyof SignatureContent]}
                        </span>
                        <span className="text-[8px] md:text-[10px] tracking-[0.2em] uppercase text-primary/50 font-medium">
                          {content[`stat_${i}_label` as keyof SignatureContent]}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                /* Skeleton Placeholder while loading */
                <div className="space-y-8 py-10">
                   <div className="h-4 w-32 bg-white/5 rounded mx-auto lg:mx-0 animate-pulse" />
                   <div className="h-20 w-full bg-white/5 rounded animate-pulse" />
                   <div className="h-20 w-full bg-white/5 rounded animate-pulse" />
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
