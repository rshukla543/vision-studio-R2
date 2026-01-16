import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image_url: string;
  preview_image_url?: string | null;
  is_video?: boolean;
};

export function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const [hiResLoaded, setHiResLoaded] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const isLoaded = slides.length > 0;

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true });

      const videoSlide: HeroSlide = {
        id: 'intro-video',
        title: '',
        subtitle: '',
        description: '',
        image_url: '/logo-reveal.mp4',
        is_video: true,
      };

      if (!error && data) {
        setSlides([videoSlide, ...data]);
        setIsReady(true);
      } else {
        setSlides([videoSlide]);
        setIsReady(true);
      }
    };

    fetchSlides();
  }, []);

  /* ---------------- VIDEO CONTROL ---------------- */
  useEffect(() => {
    if (!videoRef.current) return;

    if (slides[currentSlide]?.is_video) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (videoRef.current) videoRef.current.muted = true;
        });
      }

      videoRef.current.muted = isMuted;
    } else {
      videoRef.current.pause();
    }
  }, [currentSlide, isMuted, slides]);

  /* ---------------- NAVIGATION ---------------- */
  const nextSlide = useCallback(() => {
    if (!isLoaded) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [isLoaded, slides.length]);

  const prevSlide = useCallback(() => {
    if (!isLoaded) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [isLoaded, slides.length]);

  useEffect(() => {
    if (!isLoaded || slides[currentSlide]?.is_video) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, isLoaded, currentSlide, slides]);

  const shouldShowContent =
    isLoaded &&
    isReady &&
    slides[currentSlide] &&
    !slides[currentSlide].is_video;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {isLoaded &&
        slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                isActive ? 'opacity-100 z-20' : 'opacity-0 z-10'
              )}
            >
              {slide.is_video ? (
                <video
                  ref={videoRef}
                  src={slide.image_url}
                  playsInline
                  autoPlay
                  muted={isMuted}
                  onEnded={nextSlide}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  {/* PREVIEW IMAGE */}
                  {slide.preview_image_url && (
                    <img
                      src={slide.preview_image_url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
                    />
                  )}

                  {/* HI-RES IMAGE */}
                  <img
                    src={slide.image_url}
                    alt=""
                    onLoad={() =>
                      setHiResLoaded((prev) => ({
                        ...prev,
                        [slide.id]: true,
                      }))
                    }
                    className={cn(
                      'absolute inset-0 w-full h-full object-cover transition-opacity duration-700',
                      hiResLoaded[slide.id] ? 'opacity-100' : 'opacity-0',
                      isActive ? 'animate-cinematic' : ''
                    )}
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-black/40" />
            </div>
          );
        })}

      {/* VOLUME CONTROL */}
      {isLoaded && slides[currentSlide]?.is_video && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="absolute bottom-32 right-8 z-50 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary/40 transition-all"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}

      {/* ARROWS */}
      <div className="absolute inset-0 z-40 flex items-center justify-between px-4 pointer-events-none">
        <button
          onClick={prevSlide}
          className="p-4 text-white/50 hover:text-primary transition-colors pointer-events-auto"
        >
          <ChevronLeft size={48} strokeWidth={1} />
        </button>
        <button
          onClick={nextSlide}
          className="p-4 text-white/50 hover:text-primary transition-colors pointer-events-auto"
        >
          <ChevronRight size={48} strokeWidth={1} />
        </button>
      </div>

      {/* CONTENT LAYER */}
      {shouldShowContent && (
        <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-primary" />
              <span className="text-xs tracking-[0.5em] uppercase text-primary font-medium">
                {slides[currentSlide]?.description}
              </span>
              <span className="w-12 h-px bg-primary" />
            </div>

            <h1 className="font-serif text-6xl md:text-8xl text-white font-light">
              {slides[currentSlide]?.title}
            </h1>

            <h2 className="font-serif text-6xl md:text-8xl text-primary italic font-light mt-2">
              {slides[currentSlide]?.subtitle}
            </h2>

            <div className="mt-12 flex gap-6 justify-center">
              <Link to="/portfolio">
                <Button variant="hero" size="lg" className="min-w-[180px]">
                  Portfolio
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="minimal" size="lg" className="min-w-[180px]">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* INDICATORS */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 flex gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={cn(
              'h-1 transition-all duration-500',
              i === currentSlide ? 'w-12 bg-primary' : 'w-4 bg-white/20'
            )}
          />
        ))}
      </div>
    </section>
  );
}


