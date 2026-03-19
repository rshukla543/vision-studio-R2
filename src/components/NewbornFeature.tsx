import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const INITIAL_DATA = {
  eyebrow_text: "A Different Kind of Magic",
  headline_base: "Welcoming",
  headline_highlight: "New Life",
  description_1: "Those tiny fingers, peaceful slumbers, and first expressions—newborn photography captures the fleeting beauty of life's most tender beginnings.",
  description_2: "With patience, gentleness, and an artistic vision, I create heirloom-quality portraits that families treasure for generations.",
  image_url: "",
  preview_image_url: "",
  primary_btn_text: "View Newborn Gallery",
  primary_btn_link: "/portfolio/gallery?category=Newborn",
  secondary_btn_text: "Learn More",
  secondary_btn_link: "/services"
};

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

// Twinkling stars component
const TwinklingStars = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 rounded-full bg-white/40"
          style={{
            left: `${10 + (i * 8) % 80}%`,
            top: `${15 + (i * 12) % 70}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

// Floating bubbles component
const FloatingBubbles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full border border-white/10 bg-white/5"
          style={{
            width: `${20 + i * 10}px`,
            height: `${20 + i * 10}px`,
            left: `${80 - i * 15}%`,
            top: `${60 + (i % 2) * 20}%`,
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-15, 15, -15],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.2,
          }}
        />
      ))}
    </div>
  );
};

// Pulsing rings component
const PulsingRings = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border border-primary/20"
          style={{
            width: `${100 + i * 60}px`,
            height: `${100 + i * 60}px`,
            left: '20%',
            top: '30%',
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
};

export function NewbornFeature() {
  const [content, setContent] = useState(INITIAL_DATA);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hiResLoaded, setHiResLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20
  });

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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setMousePosition({ x: 0, y: 0 });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  const ringVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.5 + i * 0.2,
        duration: 1,
        ease: [0.22, 1, 0.36, 1] as const
      }
    })
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden bg-[#0d0d0d]"
      style={{
        background: 'linear-gradient(135deg, #1a1512 0%, #0a0a0a 50%, #1a1612 100%)',
      }}
    >
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Additional animated background elements */}
      <FloatingParticles />
      <TwinklingStars />
      <FloatingBubbles />
      <PulsingRings />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Image Column with 3D tilt */}
          <motion.div
            ref={imageRef}
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="relative flex justify-center order-first lg:order-first"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Subtle ambient glow behind image */}
            <div className="absolute -inset-6 md:-inset-10 rounded-full bg-gradient-to-br from-primary/10 via-transparent to-amber-500/10 blur-2xl opacity-60" />
            
            {/* Soft border accent */}
            <div className="absolute -inset-1 md:-inset-2 rounded-full border border-primary/20" />

            {/* Main 3D tilt image container */}
            <motion.div
              variants={imageVariants}
              style={{
                rotateX,
                rotateY,
                transformPerspective: 1000,
              }}
              className="relative w-64 h-64 md:w-[450px] md:h-[450px] rounded-full overflow-hidden border border-white/10 shadow-2xl bg-white/5 cursor-pointer"
            >
              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${50 + mousePosition.x * 50}% ${50 + mousePosition.y * 50}%, rgba(212,175,55,0.15) 0%, transparent 50%)`,
                }}
              />

              {content.image_url && (
                <>
                  <img
                    src={content.preview_image_url || content.image_url}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover blur-xl transition-opacity duration-1000",
                      hiResLoaded ? "opacity-0" : "opacity-100"
                    )}
                    alt=""
                  />
                  <motion.img
                    src={content.image_url}
                    onLoad={() => setHiResLoaded(true)}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                    alt="Newborn photography"
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-all duration-1000",
                      hiResLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    )}
                    animate={isVisible ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

              {/* Subtle vignette overlay */}
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.4)]" />
            </motion.div>
          </motion.div>

          {/* Content Column with staggered animations */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="space-y-8 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.span
                className="inline-block text-[10px] tracking-[0.5em] uppercase text-primary font-semibold"
                whileHover={{ scale: 1.05, letterSpacing: "0.55em" }}
                transition={{ duration: 0.3 }}
              >
                {content.eyebrow_text}
              </motion.span>

              <motion.h2
                variants={itemVariants}
                className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight"
              >
                {content.headline_base}
                <motion.span
                  className="block italic text-primary mt-2"
                  animate={isVisible ? {
                    textShadow: [
                      "0 0 20px rgba(212,175,55,0)",
                      "0 0 40px rgba(212,175,55,0.3)",
                      "0 0 20px rgba(212,175,55,0)"
                    ]
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {content.headline_highlight}
                </motion.span>
              </motion.h2>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6 max-w-lg mx-auto lg:mx-0">
              <motion.p
                className="text-base md:text-lg text-white/60 leading-relaxed font-light"
                whileHover={{ color: "rgba(255,255,255,0.8)" }}
                transition={{ duration: 0.3 }}
              >
                {content.description_1}
              </motion.p>

              <motion.div
                className="relative"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
                <p className="text-sm text-white/40 leading-relaxed italic pl-6 text-left mx-auto lg:mx-0">
                  {content.description_2}
                </p>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 px-8 tracking-widest uppercase text-xs border-primary/30 hover:bg-primary hover:text-black hover:border-primary transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                >
                  <Link to="/portfolio?category=Newborn">{content.primary_btn_text}</Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="minimal"
                  className="h-12 px-8 tracking-widest uppercase text-xs hover:text-primary transition-all duration-300"
                >
                  <Link to={content.secondary_btn_link}>{content.secondary_btn_text}</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
