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
import { SectionDivider } from '@/components/SectionDivider';
import { PageTransition } from '@/components/PageTransition';

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSlider />
          <SectionDivider variant="gold" />
          <NewbornFeature />
          <SectionDivider variant="subtle" />
          <SignatureStyle />
          <SectionDivider variant="gold" />
          <TestimonialsSection />
          <SectionDivider variant="subtle" />
          <MasonryGallery />
          <SectionDivider variant="gold" />
          <WeddingThemes />
          <SectionDivider variant="subtle" />
          <ContactWizard />
          <SectionDivider variant="gold" />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
