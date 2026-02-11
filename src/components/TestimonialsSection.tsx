import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';

const EASE = cubicBezier(0.22, 1, 0.36, 1);

type Testimonial = {
  id: string;
  name: string;
  quote: string;
  event: string;
  image_url: string;
};

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const animationLock = useRef(false);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    supabase
      .from('testimonials')
      .select('id, name, quote, event, image_url')
      .order('id', { ascending: false })
      .then(({ data }) => {
        if (data?.length) setTestimonials(data);
      });
  }, []);

  /* ---------------- SLIDER CORE ---------------- */
  const goToSlide = (index: number) => {
    if (animationLock.current || index === currentIndex) return;
    animationLock.current = true;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setTimeout(() => { animationLock.current = false; }, 600);
  };

  const nextSlide = () => goToSlide((currentIndex + 1) % testimonials.length);
  const prevSlide = () => goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length);

  /* ---------------- AUTO ROTATE ---------------- */
  useEffect(() => {
    if (!testimonials.length) return;
    const interval = setInterval(() => {
      if (!animationLock.current) nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, testimonials.length]);

  if (!testimonials.length) return null;
  const t = testimonials[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
  };

  return (
    <section className="relative py-32 md:py-40 bg-secondary overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: EASE }}
          className="text-center mb-20"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-primary">
            Client Stories
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-4">
            Words from the <span className="italic text-primary">Heart</span>
          </h2>
        </motion.div>

        {/* CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid lg:grid-cols-5 gap-12 items-center">

            {/* IMAGE */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-3 rounded-full border border-primary/20 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute -inset-6 rounded-full border border-primary/10" />

                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-primary/30 relative z-10">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.img
                      key={t.id}
                      src={t.image_url}
                      alt={t.name}
                      draggable={false}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5, ease: EASE }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* TEXT */}
            <div className="lg:col-span-3 relative">
              <Quote className="absolute -top-6 -left-4 w-12 h-12 text-primary/15" />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={t.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl italic leading-relaxed text-foreground/90">
                    "{t.quote}"
                  </blockquote>

                  <div className="mt-8">
                    <p className="text-primary font-medium tracking-wide">
                      {t.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.event}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* NAV */}
          <div className="flex items-center justify-center gap-6 mt-16">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              className="p-3 border border-border/50 hover:border-primary/50 transition-colors duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-500',
                    i === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/60'
                  )}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              className="p-3 border border-border/50 hover:border-primary/50 transition-colors duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
