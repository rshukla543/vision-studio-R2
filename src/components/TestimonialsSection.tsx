import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Testimonial = {
  id: string;
  name: string;
  quote: string;
  event: string;
  image_url: string;
};

const ANIMATION_DURATION = 500;

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
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

  /* ---------------- SCROLL IN ---------------- */
  useEffect(() => {
    if (!testimonials.length || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.1) {
        // if (entry.isIntersecting) {
          setIsVisible(true);
          hasAnimated.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [testimonials.length]);

  /* ---------------- SLIDER CORE ---------------- */
  const goToSlide = (index: number) => {
    if (animationLock.current || index === currentIndex) return;

    animationLock.current = true;
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
      animationLock.current = false;
    }, ANIMATION_DURATION);
  };

  const nextSlide = () =>
    goToSlide((currentIndex + 1) % testimonials.length);

  const prevSlide = () =>
    goToSlide(
      (currentIndex - 1 + testimonials.length) %
        testimonials.length
    );

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

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-secondary overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div
          className={cn(
            'text-center mb-20 transition-all duration-1000',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-primary">
            Client Stories
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-4">
            Words from the <span className="italic text-primary">Heart</span>
          </h2>
        </div>

        {/* CONTENT */}
        <div
          className={cn(
            'max-w-5xl mx-auto transition-all duration-1000 delay-150',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <div className="grid lg:grid-cols-5 gap-12 items-center">

            {/* IMAGE */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative group">
                {/* Rings */}
                <div className="absolute -inset-3 rounded-full border border-primary/20" />
                <div className="absolute -inset-6 rounded-full border border-primary/10" />

                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-primary/30 relative z-10">
                  <img
                    src={t.image_url}
                    alt={t.name}
                    draggable={false}
                    className={cn(
                      'w-full h-full object-cover transition-all ease-out group-hover:scale-105',
                      isAnimating ? 'opacity-0' : 'opacity-100'
                    )}
                    style={{ transitionDuration: `${ANIMATION_DURATION}ms` }}
                  />
                </div>
              </div>
            </div>

            {/* TEXT */}
            <div className="lg:col-span-3 relative">
              <Quote className="absolute -top-6 -left-4 w-12 h-12 text-primary/20" />

              <blockquote
                className={cn(
                  'font-serif text-xl md:text-2xl lg:text-3xl italic leading-relaxed transition-all ease-out',
                  isAnimating
                    ? 'opacity-0 translate-x-4'
                    : 'opacity-100 translate-x-0'
                )}
                style={{ transitionDuration: `${ANIMATION_DURATION}ms` }}
              >
                “{t.quote}”
              </blockquote>

              <div
                className={cn(
                  'mt-8 transition-opacity',
                  isAnimating ? 'opacity-0' : 'opacity-100'
                )}
                style={{ transitionDuration: `${ANIMATION_DURATION}ms` }}
              >
                <p className="text-primary font-medium tracking-wide">
                  {t.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.event}
                </p>
              </div>
            </div>
          </div>

          {/* NAV */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button onClick={prevSlide} className="p-3 border border-border/50">
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* DOTS */}
            <div className="flex gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === currentIndex
                      ? 'bg-primary w-6'
                      : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/60'
                  )}
                />
              ))}
            </div>

            <button onClick={nextSlide} className="p-3 border border-border/50">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
