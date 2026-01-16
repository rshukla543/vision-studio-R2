
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type AboutContent = {
  eyebrow_text: string | null;
  headline: string | null;
  highlighted_word: string | null;

  body_paragraph_1: string | null;
  body_paragraph_2: string | null;

  weddings_label: string | null;
  weddings_count: string | null;
  experience_label: string | null;
  experience_years: string | null;

  quote_text: string | null;

  portrait_image_url: string | null;
  portrait_image_preview_url: string | null;
};

export function AboutSection() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hiLoaded, setHiLoaded] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    supabase
      .from("about_content")
      .select("*")
      .eq("singleton_key", 1)
      .limit(1)
      .then(({ data }) => data && setContent(data[0]));
  }, []);

  useEffect(() => {
    if (!content || hasAnimated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          hasAnimated.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    sectionRef.current && observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [content]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative py-32 bg-background min-h-screen transition-all duration-700 ease-out",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="container mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-20 items-center mb-28">

          {/* IMAGE */}
          <div
            className={cn(
              "relative aspect-[4/5] transition-all duration-1000",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            )}
          >
            {/* Outer sculpted frame */}
            <div className="absolute -inset-4 rounded-[2.5rem] pointer-events-none">
              <div className="absolute inset-0 rounded-[2.5rem] border border-[#c9a24d]/30" />
              <div className="absolute inset-[6px] rounded-[2.2rem] border border-[#c9a24d]/10" />
            </div>

            {/* <div className="absolute -inset-4 rounded-[2.5rem] border border-primary/20 pointer-events-none" /> */}

            {/* Inner image shell */}
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white/5">

              {/* <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white/5 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"> */}

              {/* Film grain */}
              <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

              {/* Preview */}
              {content?.portrait_image_preview_url && (
                <img
                  src={content.portrait_image_preview_url}
                  className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-70"
                />
              )}

              {/* Hi-res */}
              {content?.portrait_image_url && (
                <img
                  src={content.portrait_image_url}
                  onLoad={() => setHiLoaded(true)}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                    hiLoaded ? "opacity-100" : "opacity-0"
                  )}
                />
              )}

              {/* Edge light */}
              <div className="absolute inset-0 ring-1 ring-[#c9a24d]/15" />

              {/* <div className="absolute inset-0 ring-1 ring-white/10" /> */}

              {/* Bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
          </div>

          {/* TEXT */}
          <div
            className={cn(
              "space-y-12 pt-6 transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            )}
          >
            <span className="inline-block text-[11px] tracking-[0.45em] uppercase text-primary/80 border-b border-primary/20 pb-3">
              {content?.eyebrow_text}
            </span>

            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1]">
              {content?.headline}{" "}
              <span className="block italic text-primary mt-2">
                {content?.highlighted_word}
              </span>
            </h2>

            {/* Body copy */}
            <div className="space-y-8 max-w-xl">
              <p className="text-lg leading-relaxed text-foreground/70">
                {content?.body_paragraph_1}
              </p>
              <p className="text-sm leading-loose text-foreground/40 italic border-l border-primary/20 pl-6">
                {content?.body_paragraph_2}
              </p>
            </div>

            {/* Expertise / Experience */}
            <div className="grid grid-cols-2 gap-12 pt-10 border-t border-border/40">
              <div className="space-y-3">
                <span className="block font-serif text-6xl text-primary leading-none">
                  {content?.weddings_count}
                </span>
                <span className="block text-[11px] tracking-[0.4em] uppercase text-muted-foreground">
                  {content?.weddings_label}
                </span>
              </div>

              <div className="space-y-3">
                <span className="block font-serif text-6xl text-primary leading-none">
                  {content?.experience_years}
                </span>
                <span className="block text-[11px] tracking-[0.4em] uppercase text-muted-foreground">
                  {content?.experience_label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QUOTE — untouched */}
        {content?.quote_text && (
          <div
            className={cn(
              "max-w-2xl mx-auto text-center pt-20 border-t border-border/30 transition-all duration-1000 delay-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl italic text-foreground/80">
              “{content.quote_text}”
            </blockquote>
          </div>
        )}
      </div>
    </section>

  );
}
