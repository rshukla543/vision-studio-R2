import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactWizard } from '@/components/ContactWizard';
import { PageTransition } from '@/components/PageTransition';

const Contact = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <ContactWizard />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Contact;
