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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSlider />
        <SignatureStyle />
        <WeddingThemes />
        <AboutSection />
        <NewbornFeature />
        <MasonryGallery />
        <TestimonialsSection />
        <ContactWizard />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
