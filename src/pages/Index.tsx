import { Header } from '@/components/Header';

import { HeroSlider } from '@/components/HeroSlider';

import { Footer } from '@/components/Footer';

import { SignatureStyle } from '@/components/SignatureStyle';

import { WeddingThemes } from '@/components/WeddingThemes';

import { NewbornFeature } from '@/components/NewbornFeature';

import { MasonryGallery } from '@/components/MasonryGallery';

import { TestimonialsSection } from '@/components/TestimonialsSection';

import { AboutSection } from '@/components/AboutSection';

import { ContactWizard } from '@/components/ContactWizard';

import { PageTransition } from '@/components/PageTransition';

import { SectionDivider, ElegantDivider } from '@/components/SectionDivider';



const Index = () => {

  return (

    <PageTransition>

      <div className="min-h-screen bg-charcoal-deep">

        <Header />

        <main className="bg-charcoal-deep">

          <HeroSlider />

          

          {/* Cinematic transition from Hero to content */}

          {/* <div className="relative">

            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none z-10" />

            <SectionDivider variant="gold" className="py-8 bg-charcoal-deep" />

          </div> */}

          

          <WeddingThemes />

          

          {/* Elegant divider with warm transition */}
{/* 
          <div className="bg-gradient-to-b from-charcoal-deep via-[#0d0d0d] to-[#0d0d0d]">

            <ElegantDivider className="py-6" />

          </div>

           */}

          <NewbornFeature />

          

          {/* Subtle transition to Gallery */}
{/* 
          <div className="bg-gradient-to-b from-[#0d0d0d] via-charcoal-deep to-charcoal-deep">

            <SectionDivider variant="subtle" className="py-4" />

          </div> */}

          

          <MasonryGallery />

          

          {/* Gold accent divider before Signature */}

          <div className="bg-charcoal-deep">

            <SectionDivider variant="elegant" className="py-8" />

          </div>

          

          <SignatureStyle />

          

          {/* Transition to Contact */}

          {/* <div className="bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-charcoal-deep">

            <SectionDivider variant="subtle" className="py-6" />

          </div> */}

          

          <ContactWizard />

          

          {/* Elegant transition to About */}

          {/* <div className="bg-gradient-to-b from-charcoal-deep via-[#080808] to-[#050505]">

            <ElegantDivider className="py-8" />

          </div> */}

          

          <AboutSection />

          

          {/* Seamless transition - About and Testimonials share bg */}

          {/* <div className="bg-[#050505]">

            <SectionDivider variant="gold" className="py-6 opacity-50" />

          </div>

           */}

          <TestimonialsSection />

          

          {/* Cinematic close before Footer */}

          {/* <div className="bg-[#050505]">

            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto max-w-md" />

          </div> */}

        </main>

        <Footer />

      </div>

    </PageTransition>

  );

};



export default Index;















// import { Header } from '@/components/Header';

// import { HeroSlider } from '@/components/HeroSlider';

// import { Footer } from '@/components/Footer';

// import { SignatureStyle } from '@/components/SignatureStyle';

// import { WeddingThemes } from '@/components/WeddingThemes';

// import { NewbornFeature } from '@/components/NewbornFeature';

// import { MasonryGallery } from '@/components/MasonryGallery';

// import { TestimonialsSection } from '@/components/TestimonialsSection';

// import { AboutSection } from '@/components/AboutSection';

// import { ContactWizard } from '@/components/ContactWizard';

// import { SectionDivider } from '@/components/SectionDivider';

// import { PageTransition } from '@/components/PageTransition';



// const Index = () => {

//   return (

//     <PageTransition>

//       <div className="min-h-screen bg-background">

//         <Header />

//         <main>

//           <HeroSlider />

//           <SectionDivider variant="gold" />

//           <NewbornFeature />

//           <SectionDivider variant="subtle" />

//           <SignatureStyle />

          

//           <SectionDivider variant="subtle" />

//           <MasonryGallery />

//           <SectionDivider variant="gold" />

//           <WeddingThemes />

//           <SectionDivider variant="subtle" />

//           <ContactWizard />

//           <SectionDivider variant="gold" />

//           <AboutSection />

//           <SectionDivider variant="gold" />

//           <TestimonialsSection />

//         </main>

//         <Footer />

//       </div>

//     </PageTransition>

//   );

// };



// export default Index;

