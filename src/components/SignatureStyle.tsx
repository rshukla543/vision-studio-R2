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

// Premium "Gold" easing for smooth, heavy-feeling motion
const SMOOTH_EASE = cubicBezier(0.43, 0.13, 0.23, 0.96);

export function SignatureStyle() {
  const [content, setContent] = useState<SignatureContent | null>(null);

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

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: SMOOTH_EASE }
    }
  };

  return (
    <section className="relative py-24 md:py-40 overflow-hidden bg-[#0a0a0a]">
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* ---------------- IMAGE COLUMN ---------------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: SMOOTH_EASE }}
            className="order-first lg:order-last w-full"
          >
            {/* Subtle floating animation wrapper */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square max-w-[300px] md:max-w-[500px] flex items-center justify-center mx-auto"
            >
              {/* Decorative Rings */}
              <div className="absolute w-full h-full border border-white/[0.07] rounded-full animate-pulse" />
              <div className="absolute w-[92%] h-[92%] border border-primary/10 rounded-full" />
              
              {/* Main Image */}
              <div className="relative w-[82%] h-[82%] rounded-full overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {content ? (
                  <img
                    src={content.image_url || ''}
                    alt="Signature"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent opacity-80" />
              </div>
            </motion.div>
          </motion.div>

          {/* ---------------- TEXT COLUMN ---------------- */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-10 text-center lg:text-left"
          >
            {content && (
              <>
                <motion.div variants={itemVariants} className="space-y-4">
                  <span className="text-[10px] tracking-[0.6em] md:tracking-[0.8em] uppercase text-primary font-bold inline-block border-b border-primary/30 pb-2">
                    {content.tagline}
                  </span>

                  <h2 className="font-serif text-5xl md:text-8xl font-light text-white leading-[1] tracking-tight">
                    {content.title_line_1}
                    <span className="block italic text-primary/90 mt-2 tracking-normal">
                      {content.title_highlight}
                    </span>
                  </h2>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-6 max-w-lg mx-auto lg:mx-0">
                  <p className="text-base md:text-xl text-white/50 leading-relaxed font-light tracking-wide">
                    {content.description_1}
                  </p>
                  <p className="text-white/30 leading-relaxed text-sm italic border-l-2 border-primary/20 pl-6 text-left max-w-[90%] md:max-w-full mx-auto lg:mx-0">
                    {content.description_2}
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 md:gap-12 pt-8 border-t border-white/5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group">
                      <span className="block font-serif text-3xl md:text-5xl text-white group-hover:text-primary transition-colors duration-500">
                        {content[`stat_${i}_value` as keyof SignatureContent]}
                      </span>
                      <span className="text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-primary/50 font-medium">
                        {content[`stat_${i}_label` as keyof SignatureContent]}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
