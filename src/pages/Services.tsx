import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { motion, cubicBezier } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';

const EASE = cubicBezier(0.22, 1, 0.36, 1);

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: EASE,
    },
  },
};

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services_packages')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Supabase services error:', error);
        setLoading(false);
        return;
      }

      setServices(data || []);
      setLoading(false);
    };

    fetchServices();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-32 pb-24 overflow-hidden">
          <div className="container mx-auto px-6">

            {/* HEADER */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: EASE }}
              className="text-center mb-20"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-primary">
                Investment
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-4">
                Services & Packages
              </h1>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Every package is designed to capture your unique story with an editorial touch and cinematic vision.
              </p>
            </motion.div>

            {/* SERVICES GRID */}
            {!loading && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              >
                {services.map(service => (
                  <motion.div
                    key={service.id}
                    variants={cardVariants}
                    whileHover={{ y: -8, transition: { duration: 0.4, ease: EASE } }}
                    className={cn(
                      'relative p-8 border rounded-2xl flex flex-col group',
                      service.featured
                        ? 'border-primary bg-primary/5'
                        : 'border-border/30 bg-charcoal/30',
                      'hover:border-primary/50 transition-colors duration-500'
                    )}
                  >
                    {service.featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-[10px] tracking-[0.2em] uppercase rounded-full">
                        Most Popular
                      </span>
                    )}

                    <div className="text-center mb-8">
                      <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                        {service.subtitle}
                      </p>
                      <div className="mt-6">
                        <span className="font-serif text-3xl text-primary">
                          {service.price}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-10">
                      {Array.isArray(service.features) &&
                        service.features.map((feature: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-muted-foreground"
                          >
                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                    </ul>

                    <div className="mt-auto">
                      <Button
                        asChild
                        variant={service.featured ? 'gold' : 'outline'}
                        className="w-full"
                      >
                        <Link to="/contact">Book Now</Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4, ease: EASE }}
              className="mt-24 text-center"
            >
              <h2 className="font-serif text-3xl text-foreground mb-4">
                Looking for Something Custom?
              </h2>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Get Custom Quote</Link>
              </Button>
            </motion.div>

          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Services;
