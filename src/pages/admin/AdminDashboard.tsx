import { lazy, Suspense } from "react";
import { motion, Variants } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

import HeroSlidesAdmin from "./HeroSlidesAdmin";

// Lazy load the rest (sections below the fold)
const SignatureStyleAdmin = lazy(() => import("./SignatureStyleAdmin"));
const NewbornFeatureAdmin = lazy(() => import("./NewbornFeatureAdmin"));
const GalleryAdmin = lazy(() => import("./GalleryAdmin"));
const WeddingThemesAdmin = lazy(() => import("./WeddingThemesAdmin"));
const TestimonialsAdmin = lazy(() => import("./TestimonialsAdmin"));
const SiteSettingsAdmin = lazy(() => import("./SiteSettingsAdmin"));
const AboutContentAdmin = lazy(() => import("./AboutContentAdmin"));
const ServiceAdmin = lazy(() => import("./ServiceAdmin"));
const BookingsAdmin = lazy(() => import("./BookingsAdmin"));

const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// Section divider component
function SectionDivider() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="py-8 flex items-center justify-center"
    >
      <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="mx-4"
      >
        <Sparkles className="w-4 h-4 text-primary/40" />
      </motion.div>
      <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </motion.div>
  );
}

export default function AdminDashboard() {
  return (
    <motion.div layoutRoot className="space-y-8 md:space-y-12">
      {/* Dashboard Header */}
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariants}
        className="max-w-3xl"
      >
        <motion.div 
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          <span className="text-xs tracking-[0.4em] uppercase text-primary font-semibold">
            Control Center
          </span>
        </motion.div>
        
        <h2 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] tracking-tight">
          System <span className="italic text-primary/70">Interface</span>
        </h2>
        <p className="text-muted-foreground mt-6 text-base tracking-wide max-w-lg leading-relaxed opacity-70">
          Manage your portfolio's visual narrative. Changes are synchronized to the global CDN instantly.
        </p>
      </motion.header>

      <SectionDivider />

      {/* SECTION 1: Hero Slides - Direct Load */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
      >
        <HeroSlidesAdmin />
      </motion.section>

      <SectionDivider />

      {/* REMAINING SECTIONS: Lazy Loaded */}
      <Suspense fallback={<SectionSkeleton />}>
        <AnimatedSection>
          <BookingsAdmin />
        </AnimatedSection>

        <SectionDivider />

        <AnimatedSection>
          <GalleryAdmin />
        </AnimatedSection>

        <SectionDivider />

        <AnimatedSection>
          <WeddingThemesAdmin />
        </AnimatedSection>

        <SectionDivider />

        <AnimatedSection>
          <SignatureStyleAdmin />
        </AnimatedSection>

        <SectionDivider />

        <AnimatedSection>
          <NewbornFeatureAdmin />
        </AnimatedSection>

        <SectionDivider />

        <AnimatedSection>
          <AboutContentAdmin />
        </AnimatedSection>

        <SectionDivider />

        <AnimatedSection>
          <TestimonialsAdmin />
        </AnimatedSection>

        <SectionDivider />

        <AnimatedSection>
          <ServiceAdmin />
        </AnimatedSection>

        <SectionDivider />

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
      layout
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05, margin: "-50px" }}
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
