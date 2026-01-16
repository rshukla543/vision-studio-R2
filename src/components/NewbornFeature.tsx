import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

// 1. Initial Static Backup Data
const INITIAL_DATA = {
  eyebrow_text: "A Different Kind of Magic",
  headline_base: "Welcoming",
  headline_highlight: "New Life",
  description_1: "Those tiny fingers, peaceful slumbers, and first expressions—newborn photography captures the fleeting beauty of life's most tender beginnings.",
  description_2: "With patience, gentleness, and an artistic vision, I create heirloom-quality portraits that families treasure for generations.",
  image_url: "", // This will be the local asset path or placeholder
  primary_btn_text: "View Newborn Gallery",
  primary_btn_link: "/portfolio/gallery?category=Newborn",
  // primary_btn_link: "/portfolio/Newborn",
  secondary_btn_text: "Learn More",
  secondary_btn_link: "/services"
};

export function NewbornFeature() {
  const [content, setContent] = useState(INITIAL_DATA);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 2. Fetch Dynamic Data
  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase.from('newborn_feature').select('*').single();
      if (!error && data) {
        setContent(data);
      }
    };
    fetchContent();
  }, []);

  // 3. Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden min-h-[600px]"
      style={{
        background: 'linear-gradient(135deg, hsl(15 20% 12%) 0%, hsl(0 0% 10%) 50%, hsl(30 20% 12%) 100%)',
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blush/5 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image Column */}
          <div className={cn(
            'relative order-2 lg:order-1 flex justify-center transition-all duration-1000',
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}>
            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full border border-blush/20" />
            <div className="absolute -bottom-12 -right-8 w-48 h-48 rounded-full border border-primary/10" />

            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-blush/30 shadow-2xl">
              {content.image_url && (
                <img
                  src={content.image_url}
                  alt="Newborn photography"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent" />
            </div>
            <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-primary/20 animate-float" />
          </div>

          {/* Content Column */}
          <div className={cn(
            'order-1 lg:order-2 space-y-8 transition-all duration-1000 delay-200',
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          )}>
            <div className="space-y-4">
              <span className="text-xs tracking-[0.3em] uppercase text-blush">
                {content.eyebrow_text}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                {content.headline_base}
                <span className="block italic text-primary">{content.headline_highlight}</span>
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              {content.description_1}
            </p>

            <p className="text-muted-foreground leading-relaxed max-w-lg">
              {content.description_2}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild variant="outline" size="lg">
                <Link to="/portfolio?category=Newborn">{content.primary_btn_text}</Link>
                {/* <Link to={content.primary_btn_link}>{content.primary_btn_text}</Link> */}
              </Button>
              <Button asChild variant="minimal" size="lg">
                <Link to={content.secondary_btn_link}>{content.secondary_btn_text}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

