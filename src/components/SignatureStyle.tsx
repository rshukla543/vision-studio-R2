import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, cubicBezier, AnimatePresence } from 'framer-motion';
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
  preview_image_url?: string | null; // Make sure this is in your DB
};

const SMOOTH_EASE = cubicBezier(0.43, 0.13, 0.23, 0.96);

export function SignatureStyle() {
  const [content, setContent] = useState<SignatureContent | null>(null);
  const [hiResLoaded, setHiResLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

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

  // Animation variants optimized for mobile GPU (reduced blur radius and used hardware acceleration)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" }, // Reduced blur for performance
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: SMOOTH_EASE }
    }
  };

  return (
    <section className="relative py-20 md:py-40 overflow-hidden bg-[#0a0a0a]">
      {/* Optimization: Removed the grain overlay on mobile to save GPU fill-rate */}
      <div className="hidden md:block absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* IMAGE COLUMN with Progressive Loading */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1 }}
            className="order-first lg:order-last w-full"
          >
            <div className="relative aspect-square max-w-[280px] md:max-w-[500px] flex items-center justify-center mx-auto">
              <div className="absolute w-full h-full border border-white/[0.05] rounded-full" />
              
              <div className="relative w-[85%] h-[85%] rounded-full overflow-hidden bg-[#111]">
                {content?.image_url && (
                  <>
                    {/* LOW RES PREVIEW - Always visible until High Res is ready */}
                    <img 
                      src={content.preview_image_url || content.image_url} 
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover blur-lg scale-110 transition-opacity duration-1000",
                        hiResLoaded ? "opacity-0" : "opacity-100"
                      )}
                      alt="loading..."
                    />
                    
                    {/* HIGH RES IMAGE */}
                    <img
                      ref={imageRef}
                      src={content.image_url}
                      onLoad={() => setHiResLoaded(true)}
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 will-change-transform",
                        hiResLoaded ? "opacity-100" : "opacity-0"
                      )}
                      alt="Signature"
                    />
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* TEXT COLUMN */}
          <div className="w-full">
            <AnimatePresence>
              {content && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="space-y-8 md:space-y-10 text-center lg:text-left"
                >
                  <motion.div variants={itemVariants} className="space-y-4">
                    <span className="text-[10px] tracking-[0.4em] md:tracking-[0.8em] uppercase text-primary font-bold inline-block border-b border-primary/20 pb-2">
                      {content.tagline}
                    </span>
                    <h2 className="font-serif text-4xl md:text-8xl font-light text-white leading-tight md:leading-[1.1]">
                      {content.title_line_1}
                      <span className="block italic text-primary/90 mt-1 md:mt-2">
                        {content.title_highlight}
                      </span>
                    </h2>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6 max-w-lg mx-auto lg:mx-0">
                    <p className="text-sm md:text-xl text-white/50 leading-relaxed font-light">
                      {content.description_1}
                    </p>
                    {/* Simplified Border logic for mobile */}
                    <p className="text-white/30 leading-relaxed text-[13px] italic border-l border-primary/20 pl-4 md:pl-6 text-left mx-auto lg:mx-0">
                      {content.description_2}
                    </p>
                  </motion.div>

                  {/* STATS - Using flex-row with better spacing for mobile */}
                  <motion.div variants={itemVariants} className="flex justify-between md:grid md:grid-cols-3 gap-2 md:gap-12 pt-8 border-t border-white/5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="text-center lg:text-left">
                        <span className="block font-serif text-2xl md:text-5xl text-white">
                          {content[`stat_${i}_value` as keyof SignatureContent]}
                        </span>
                        <span className="text-[7px] md:text-[10px] tracking-[0.1em] md:tracking-[0.3em] uppercase text-primary/50 font-medium">
                          {content[`stat_${i}_label` as keyof SignatureContent]}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
