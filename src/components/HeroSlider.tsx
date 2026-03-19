
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';

const EASE = cubicBezier(0.22, 1, 0.36, 1);

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
  const dragStartX = useRef<number | null>(null);
  const isLoaded = slides.length > 0;

  /* ---------------- FETCH DATA (Original Logic) ---------------- */
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
        setSlides([...data, videoSlide]);
        setIsReady(true);
      } else {
        setSlides([videoSlide]);
        setIsReady(true);
      }
    };
    fetchSlides();
  }, []);

  /* ---------------- VIDEO CONTROL (Original Logic) ---------------- */
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

  const onStart = (clientX: number) => { dragStartX.current = clientX; };
  const onEnd = (clientX: number) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    dragStartX.current = null;
  };

  useEffect(() => {
    if (!isLoaded || slides[currentSlide]?.is_video) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, isLoaded, currentSlide, slides]);

  const shouldShowContent =
    isLoaded && isReady && slides[currentSlide] && !slides[currentSlide].is_video;

  const slideVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-background select-none touch-pan-y"
      style={{ height: 'min(100vh, 56.25vw)', minHeight: '400px' }}
      onMouseDown={(e) => onStart(e.clientX)}
      onMouseUp={(e) => onEnd(e.clientX)}
      onTouchStart={(e) => onStart(e.touches[0].clientX)}
      onTouchEnd={(e) => onEnd(e.changedTouches[0].clientX)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Slides */}
      <AnimatePresence initial={false} mode="popLayout">
        {isLoaded && slides[currentSlide] && (
          <motion.div
            key={slides[currentSlide].id}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.2, ease: EASE }}
            className="absolute inset-0 z-20"
          >
            {slides[currentSlide].is_video ? (
              <video
                ref={videoRef}
                src={slides[currentSlide].image_url}
                playsInline
                autoPlay
                muted={isMuted}
                onEnded={nextSlide}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                {slides[currentSlide].preview_image_url && (
                  <img
                    src={slides[currentSlide].preview_image_url!}
                    alt=""
                    draggable="false"
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
                  />
                )}
                <motion.img
                  src={slides[currentSlide].image_url}
                  alt=""
                  draggable="false"
                  onLoad={() => setHiResLoaded((prev) => ({ ...prev, [slides[currentSlide].id]: true }))}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 8, ease: 'linear' }}
                  className={cn(
                    'absolute inset-0 w-full h-full object-cover transition-opacity duration-700',
                    hiResLoaded[slides[currentSlide].id] ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </div>
            )}
            {/* Gradient overlay - more cinematic */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volume control (Original Logic) */}
      {isLoaded && slides[currentSlide]?.is_video && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
          className="absolute bottom-20 right-6 z-50 p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </motion.button>
      )}

      {/* Navigation arrows */}
      <div className="absolute inset-0 z-40 hidden md:flex items-center justify-between px-6 pointer-events-none">
        <motion.button
          onClick={prevSlide}
          className="pointer-events-auto p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={28} strokeWidth={1.5} />
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="pointer-events-auto p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={28} strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Content layer */}
      <AnimatePresence mode="wait">
        {shouldShowContent && (
          <motion.div
            key={`content-${currentSlide}`}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-30 h-full hidden md:flex flex-col items-center justify-center text-center px-4"
          >
            {/* Description tag */}
            <motion.div variants={itemVariants} className="mb-6 flex items-center gap-4">
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-primary/60" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-primary/80 font-medium">
                {slides[currentSlide]?.description}
              </span>
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-primary/60" />
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-foreground font-light leading-[0.9] tracking-tight"
            >
              {slides[currentSlide]?.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              variants={itemVariants}
              className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-primary italic font-light mt-1 leading-[0.9]"
            >
              {slides[currentSlide]?.subtitle}
            </motion.h2>

            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="mt-10 md:mt-14 flex gap-4 md:gap-6 justify-center">
              <Link to="/portfolio">
                <Button
                  variant="hero"
                  className="h-12 px-10 md:px-14 text-[10px] md:text-xs tracking-[0.25em] uppercase border border-primary/30 hover:border-primary transition-all duration-500"
                >
                  Portfolio
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="minimal"
                  className="h-12 px-10 md:px-14 text-[10px] md:text-xs tracking-[0.25em] uppercase border border-white/10 hover:border-white/30 transition-all duration-500"
                >
                  Book Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentSlide(i);
            }}
            className="group relative p-1"
          >
            <span
              className={cn(
                'block rounded-full transition-all duration-500 ease-out',
                i === currentSlide
                  ? 'w-8 h-1 bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]'
                  : 'w-1.5 h-1 bg-white/20 group-hover:bg-white/50'
              )}
            />
          </button>
        ))}
      </div>

      {/* Slide counter */}
      {isLoaded && !slides[currentSlide]?.is_video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 right-8 z-40 hidden md:flex items-baseline gap-1 text-white/30 font-light"
        >
          <span className="text-lg text-primary/80">{String(currentSlide + 1).padStart(2, '0')}</span>
          <span className="text-xs">/</span>
          <span className="text-xs">{String(slides.length).padStart(2, '0')}</span>
        </motion.div>
      )}
    </section>
  );
}



//#######################################################################################################



// import { useState, useEffect, useCallback, useRef } from 'react';
// import { ChevronDown, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { Link } from 'react-router-dom';
// import { supabase } from '@/lib/supabase';

// type HeroSlide = {
//   id: string;
//   title: string;
//   subtitle: string;
//   description?: string;
//   image_url: string;
//   preview_image_url?: string | null;
//   is_video?: boolean;
// };

// export function HeroSlider() {
//   const [slides, setSlides] = useState<HeroSlide[]>([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isMuted, setIsMuted] = useState(true);
//   const [isReady, setIsReady] = useState(false);
//   const [hiResLoaded, setHiResLoaded] = useState<Record<string, boolean>>({});

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const dragStartX = useRef<number | null>(null); // For Swipe/Drag
//   const isLoaded = slides.length > 0;

//   /* ---------------- FETCH DATA (Original Logic) ---------------- */
//   useEffect(() => {
//     const fetchSlides = async () => {
//       const { data, error } = await supabase
//         .from('hero_slides')
//         .select('*')
//         .order('order_index', { ascending: true });

//       const videoSlide: HeroSlide = {
//         id: 'intro-video',
//         title: '',
//         subtitle: '',
//         description: '',
//         image_url: '/logo-reveal.mp4',
//         is_video: true,
//       };

//       if (!error && data) {
//         // Move video to the end so it loads last
//         setSlides([...data, videoSlide]);
//         setIsReady(true);
//       } else {
//         setSlides([videoSlide]);
//         setIsReady(true);
//       }
//     };
//     fetchSlides();
//   }, []);

//   /* ---------------- VIDEO CONTROL (Original Logic) ---------------- */
//   useEffect(() => {
//     if (!videoRef.current) return;
//     if (slides[currentSlide]?.is_video) {
//       videoRef.current.currentTime = 0;
//       const playPromise = videoRef.current.play();
//       if (playPromise !== undefined) {
//         playPromise.catch(() => {
//           if (videoRef.current) videoRef.current.muted = true;
//         });
//       }
//       videoRef.current.muted = isMuted;
//     } else {
//       videoRef.current.pause();
//     }
//   }, [currentSlide, isMuted, slides]);

//   /* ---------------- NAVIGATION (Enhanced) ---------------- */
//   const nextSlide = useCallback(() => {
//     if (!isLoaded) return;
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   }, [isLoaded, slides.length]);

//   const prevSlide = useCallback(() => {
//     if (!isLoaded) return;
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   }, [isLoaded, slides.length]);

//   // Unified Swipe Support (Mobile & Desktop)
//   const onStart = (clientX: number) => { dragStartX.current = clientX; };
//   const onEnd = (clientX: number) => {
//     if (dragStartX.current === null) return;
//     const diff = dragStartX.current - clientX;
//     if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
//     dragStartX.current = null;
//   };

//   useEffect(() => {
//     if (!isLoaded || slides[currentSlide]?.is_video) return;
//     const interval = setInterval(nextSlide, 6000);
//     return () => clearInterval(interval);
//   }, [nextSlide, isLoaded, currentSlide, slides]);

//   const shouldShowContent =
//     isLoaded && isReady && slides[currentSlide] && !slides[currentSlide].is_video;

//   return (
//     <section 
//       /* FIX 4: Aspect Ratio Lock for proper width fitting */
//       className="relative w-full h-[56.25vw] md:h-screen max-w-full overflow-hidden bg-black select-none touch-pan-y"
//       // className="relative w-full max-w-[100vw] overflow-hidden bg-black select-none touch-pan-y"
//       style={{ aspectRatio: window.innerWidth < 768 ? '16/9' : '21/9', minHeight: '400px' }}
//       onMouseDown={(e) => onStart(e.clientX)}
//       onMouseUp={(e) => onEnd(e.clientX)}
//       onTouchStart={(e) => onStart(e.touches[0].clientX)}
//       onTouchEnd={(e) => onEnd(e.changedTouches[0].clientX)}
//     >


//       {isLoaded &&
//         slides.map((slide, index) => {
//           const isActive = index === currentSlide;

//           return (
//             <div
//               key={slide.id}
//               className={cn(
//                 /* FIX 3: Blur & Scale Transition */
//                 'absolute inset-0 transition-all duration-1000 ease-in-out',
//                 isActive ? 'opacity-100 z-20 scale-100 blur-0' : 'opacity-0 z-10 scale-110 blur-md'
//               )}
//             >
//               {slide.is_video ? (
//                 <video
//                   ref={videoRef}
//                   src={slide.image_url}
//                   playsInline autoPlay
//                   muted={isMuted}
//                   onEnded={nextSlide}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="relative w-full h-full">
//                   {slide.preview_image_url && (
//                     <img
//                       src={slide.preview_image_url}
//                       alt=""
//                       className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
//                     />
//                   )}
//                   <img
//                     src={slide.image_url}
//                     alt=""
//                     onLoad={() => setHiResLoaded((prev) => ({ ...prev, [slide.id]: true }))}
//                     className={cn(
//                       'absolute inset-0 w-full h-full object-cover transition-opacity duration-700',
//                       hiResLoaded[slide.id] ? 'opacity-100' : 'opacity-0',
//                       isActive ? 'animate-cinematic' : ''
//                     )}
//                   />
//                 </div>
//               )}
//               <div className="absolute inset-0 bg-black/30" />
//             </div>
//           );
//         })}

//       {/* VOLUME CONTROL (Original Logic) */}
//       {isLoaded && slides[currentSlide]?.is_video && (
//         <button
//           onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
//           className="absolute bottom-16 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all active:scale-90"
//         >
//           {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
//         </button>
//       )}

//       {/* ARROWS (Enhanced Desktop Hover) */}
//       <div className="absolute inset-0 z-40 flex items-center justify-between px-4 pointer-events-none hidden md:flex">
//         <button onClick={prevSlide} className="p-4 text-white/30 hover:text-primary transition-all pointer-events-auto hover:scale-125">
//           <ChevronLeft size={48} strokeWidth={1} />
//         </button>
//         <button onClick={nextSlide} className="p-4 text-white/30 hover:text-primary transition-all pointer-events-auto hover:scale-125">
//           <ChevronRight size={48} strokeWidth={1} />
//         </button>
//       </div>

//       {/* CONTENT LAYER (Fix 5: Enhanced Animations) */}
//       {shouldShowContent && (
//         <div className="relative z-30 h-full hidden md:flex flex-col items-center justify-center text-center px-4 overflow-hidden">
//           <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 zoom-in-95">
//             <div className="mb-4 flex items-center justify-center gap-3">
//               <span className="w-8 md:w-12 h-px bg-primary/60" />
//               <span className="text-[8px] md:text-xs tracking-[0.4em] uppercase text-primary font-bold">
//                 {slides[currentSlide]?.description}
//               </span>
//               <span className="w-8 md:w-12 h-px bg-primary/60" />
//             </div>

//             <h1 className="font-serif text-3xl md:text-8xl text-white font-light leading-none tracking-tight">
//               {slides[currentSlide]?.title}
//             </h1>

//             <h2 className="font-serif text-3xl md:text-8xl text-primary italic font-light mt-1 md:mt-2 leading-none">
//               {slides[currentSlide]?.subtitle}
//             </h2>

//             <div className="mt-6 md:mt-12 flex gap-4 md:gap-6 justify-center">
//               <Link to="/portfolio">
//                 <Button variant="hero" className="h-10 md:h-12 px-6 md:px-12 text-[10px] md:text-sm tracking-[0.2em] uppercase">
//                   Portfolio
//                 </Button>
//               </Link>
//               <Link to="/contact">
//                 <Button variant="minimal" className="h-10 md:h-12 px-6 md:px-12 text-[10px] md:text-sm tracking-[0.2em] uppercase">
//                   Book Now
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* INDICATORS (Fix 2: Dots instead of Dashes) */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
//         {slides.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setCurrentSlide(i)}
//             className={cn(
//               'rounded-full transition-all duration-500 ease-out',
//               i === currentSlide
//                 ? 'w-8 h-1 bg-primary'
//                 : 'w-1.5 h-1 bg-white/20 hover:bg-white/40'
//             )}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }
