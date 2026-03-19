import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';

const EASE = [0.22, 1, 0.36, 1] as const;

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services_packages')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        setServices(data);
        setDataLoaded(true);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-white">
        <Header />

        {/* Global background ambience */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] pointer-events-none" />

        <main className="pt-32 pb-24 relative z-10">
          <div className="container mx-auto px-6">

            {/* HEADER AREA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={dataLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: EASE }}
              className="text-center mb-24"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8 bg-primary/30" />
                <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em]">
                  Investment
                </span>
                <span className="h-px w-8 bg-primary/30" />
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-white">
                Services & <span className="italic">Packages</span>
              </h1>
              <p className="text-white/40 mt-6 max-w-xl mx-auto font-light leading-relaxed">
                Tailored collections designed to preserve your most cherished chapters with an editorial perspective.
              </p>
            </motion.div>

            {/* SERVICES GRID */}
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {dataLoaded && services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.15,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className={cn(
                    'relative p-10 rounded-[2rem] flex flex-col group border transition-all duration-500 hover:shadow-[0_0_60px_rgba(214,179,92,0.15)]',
                    service.featured
                      ? 'border-primary/40 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.5)]'
                      : 'border-white/5 bg-white/[0.02] hover:border-primary/30'
                  )}
                >
                  {/* Tapered Frame for Featured Card */}
                  {service.featured && (
                    <div className="absolute -top-px -left-px w-20 h-20 border-t border-l border-primary/60 rounded-tl-[2rem] [mask-image:linear-gradient(to_bottom_right,black,transparent)]" />
                  )}

                  {service.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-primary text-black text-[9px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl flex items-center gap-2">
                      <Sparkles size={10} />
                      Most Coveted
                    </div>
                  )}

                  <div className="text-center mb-10">
                    <h3 className="font-serif text-3xl text-white mb-2 group-hover:text-primary transition-colors duration-500">
                      {service.title}
                    </h3>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-semibold italic">
                      {service.subtitle}
                    </p>
                    <div className="mt-8 flex items-baseline justify-center gap-1">
                      <span className="font-serif text-4xl text-primary">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/5 mb-8" />

                  <ul className="space-y-5 mb-12 flex-grow">
                    {Array.isArray(service.features) &&
                      service.features.map((feature: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-4 text-sm text-white/50 font-light"
                        >
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0 opacity-70" />
                          {feature}
                        </li>
                      ))}
                  </ul>

                  <div className="mt-auto">
                    <Button
                      asChild
                      variant={service.featured ? 'gold' : 'outline'}
                      className={cn(
                        "w-full h-14 rounded-xl font-bold uppercase text-[10px] tracking-[0.3em] transition-all",
                        service.featured && "hover:shadow-[0_0_30px_rgba(214,179,92,0.3)]"
                      )}
                    >
                      <Link to="/contact">Request Booking</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CUSTOM CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="mt-32 pt-16 border-t border-white/5 text-center"
            >
              <h2 className="font-serif text-3xl md:text-4xl italic text-white/80 mb-6">
                Seeking a bespoke experience?
              </h2>
              <Button asChild variant="outline" size="lg" className="rounded-full px-10 border-white/10 hover:border-primary/40">
                <Link to="/contact">Curate Your Collection</Link>
              </Button>
            </motion.div>

          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        .bg-charcoal\/30 { background-color: rgba(20, 20, 20, 0.3); }
      `}</style>
    </PageTransition>
  );
};

export default Services;
