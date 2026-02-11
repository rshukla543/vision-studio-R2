import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MasonryGallery } from '@/components/MasonryGallery';
import { PageTransition } from '@/components/PageTransition';

const Portfolio = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 overflow-x-hidden">
          <MasonryGallery />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Portfolio;
