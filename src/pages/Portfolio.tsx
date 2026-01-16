import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MasonryGallery } from '@/components/MasonryGallery';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 overflow-x-hidden">
        <MasonryGallery />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;