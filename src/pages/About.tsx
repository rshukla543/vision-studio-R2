import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AboutSection } from '@/components/AboutSection';
import { PageTransition } from '@/components/PageTransition';

const About = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-0 overflow-hidden">
          <AboutSection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default About;
