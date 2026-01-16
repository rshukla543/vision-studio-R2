import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactWizard } from '@/components/ContactWizard';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <ContactWizard />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
