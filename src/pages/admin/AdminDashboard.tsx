import { lazy, Suspense } from "react";
import { motion, Variants } from "framer-motion";
import { Loader2 } from "lucide-react";

import HeroSlidesAdmin from "./HeroSlidesAdmin";

// Lazy load the rest (sections below the fold)
const SignatureStyleAdmin = lazy(() => import("./SignatureStyleAdmin"));
const NewbornFeatureAdmin = lazy(() => import("./NewbornFeatureAdmin"));
const GalleryAdmin = lazy(() => import("./GalleryAdmin"));
const TestimonialsAdmin = lazy(() => import("./TestimonialsAdmin"));
const SiteSettingsAdmin = lazy(() => import("./SiteSettingsAdmin"));
const AboutContentAdmin = lazy(() => import("./AboutContentAdmin"));
const ServiceAdmin = lazy(() => import("./ServiceAdmin"));
const BookingsAdmin = lazy(() => import("./BookingsAdmin"));

const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20, // Reduced from 40 to 20 to make the initial "jump" less aggressive
    filter: "blur(8px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] // Snappier premium ease
    }
  }
};

export default function AdminDashboard() {
  return (
    // layoutRoot helps Framer sync all nested animations
    <motion.div layoutRoot className="space-y-32">
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariants}
        className="max-w-3xl"
      >
        <span className="text-xs tracking-[0.4em] uppercase text-primary font-semibold border-l-2 border-primary pl-4">
          Control Center
        </span>
        <h2 className="text-5xl md:text-7xl font-serif mt-6 text-white leading-[1.1] tracking-tight">
          System <span className="italic opacity-30 font-light underline decoration-primary/20 underline-offset-8">Interface</span>
        </h2>
        <p className="text-muted-foreground mt-6 text-base tracking-wide max-w-lg leading-relaxed opacity-70">
          Manage your portfolio’s visual narrative. Changes are synchronized to the global CDN instantly.
        </p>
      </motion.header>
      {/* SECTION 1: Direct Load to prevent stutter */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }} // Triggers slightly before it hits view
        variants={revealVariants}
      >
        <HeroSlidesAdmin />
      </motion.section>

      {/* REMAINING SECTIONS: Lazy Loaded */}
      <Suspense fallback={<SectionSkeleton />}>

        <AnimatedSection>
          <BookingsAdmin />
        </AnimatedSection>

        <AnimatedSection>
          <GalleryAdmin />
        </AnimatedSection>

        <AnimatedSection>
          <SignatureStyleAdmin />
        </AnimatedSection>

        <AnimatedSection>
          <NewbornFeatureAdmin />
        </AnimatedSection>

        <AnimatedSection>
          <AboutContentAdmin />
        </AnimatedSection>

        <AnimatedSection>
          <TestimonialsAdmin />
        </AnimatedSection>

        <AnimatedSection>
          <ServiceAdmin />
        </AnimatedSection>


        <AnimatedSection>
          <SiteSettingsAdmin />
        </AnimatedSection>








      </Suspense>

      <div className="pb-32" />
    </motion.div>
  );
}

function AnimatedSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      layout // 2. FIX: Handle layout shifts automatically
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={revealVariants}
    >
      {children}
    </motion.section>
  );
}

function SectionSkeleton() {
  return (
    <div className="w-full h-[400px] bg-white/[0.02] rounded-[2.5rem] border border-white/5 flex items-center justify-center">
      <Loader2 className="animate-spin text-primary/20" size={32} />
    </div>
  );
}
