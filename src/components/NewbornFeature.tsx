import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const INITIAL_DATA = {
  eyebrow_text: "A Different Kind of Magic",
  headline_base: "Welcoming",
  headline_highlight: "New Life",
  description_1: "Those tiny fingers, peaceful slumbers, and first expressions—newborn photography captures the fleeting beauty of life's most tender beginnings.",
  description_2: "With patience, gentleness, and an artistic vision, I create heirloom-quality portraits that families treasure for generations.",
  image_url: "",
  preview_image_url: "", // Added for progressive loading
  primary_btn_text: "View Newborn Gallery",
  primary_btn_link: "/portfolio/gallery?category=Newborn",
  secondary_btn_text: "Learn More",
  secondary_btn_link: "/services"
};

export function NewbornFeature() {
  const [content, setContent] = useState(INITIAL_DATA);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hiResLoaded, setHiResLoaded] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase.from('newborn_feature').select('*').single();
      if (!error && data) setContent(data);
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden bg-[#0d0d0d]"
      style={{
        background: 'linear-gradient(135deg, #1a1512 0%, #0a0a0a 50%, #1a1612 100%)',
      }}
    >
      {/* THE CULPRIT FIXED: Added pointer-events-none and constrained width */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] max-w-full rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Image Column - Stays on top for Mobile */}
          <div className={cn(
            'relative flex justify-center transition-all duration-1000 ease-out order-first lg:order-first',
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 blur-sm'
          )}>
            {/* Decorative Rings */}
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border border-primary/10 animate-pulse" />
            <div className="absolute -bottom-10 -right-6 w-40 h-40 rounded-full border border-primary/5" />

            {/* Main Progressive Image Container */}
            <div className="relative w-64 h-64 md:w-[450px] md:h-[450px] rounded-full overflow-hidden border border-white/10 shadow-2xl bg-white/5">
              {content.image_url && (
                <>
                  <img
                    src={content.preview_image_url || content.image_url}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover blur-xl transition-opacity duration-1000",
                      hiResLoaded ? "opacity-0" : "opacity-100"
                    )}
                    alt=""
                  />
                  <img
                    src={content.image_url}
                    onLoad={() => setHiResLoaded(true)}
                    alt="Newborn photography"
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-all duration-1000",
                      hiResLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    )}
                  />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
            </div>
            
            {/* Small floating accent */}
            <div className="absolute top-1/2 -right-2 w-6 h-6 rounded-full bg-primary/20 blur-sm animate-bounce duration-[3000ms]" />
          </div>

          {/* Content Column */}
          <div className={cn(
            'space-y-8 transition-all duration-1000 delay-300 text-center lg:text-left',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}>
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.5em] uppercase text-primary font-semibold">
                {content.eyebrow_text}
              </span>
              <h2 className="font-serif text-4xl md:text-7xl font-light text-white leading-tight">
                {content.headline_base}
                <span className="block italic text-primary mt-2">{content.headline_highlight}</span>
              </h2>
            </div>

            <div className="space-y-6 max-w-lg mx-auto lg:mx-0">
                <p className="text-base md:text-lg text-white/60 leading-relaxed font-light">
                {content.description_1}
                </p>

                <p className="text-sm text-white/40 leading-relaxed italic border-l-2 border-primary/20 pl-6 text-left mx-auto lg:mx-0">
                {content.description_2}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start">
              <Button asChild variant="outline" className="h-12 px-8 tracking-widest uppercase text-xs border-primary/20 hover:bg-primary hover:text-black transition-all duration-500">
                <Link to="/portfolio?category=Newborn">{content.primary_btn_text}</Link>
              </Button>
              <Button asChild variant="minimal" className="h-12 px-8 tracking-widest uppercase text-xs">
                <Link to={content.secondary_btn_link}>{content.secondary_btn_text}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
