import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Facebook, Mail, Phone, MapPin, Aperture } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type SiteSettings = {
  brand_name: string | null;
  brand_tagline: string | null;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  facebook_handle: string | null;
  contact_location: string | null;
};

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<null | 'email' | 'phone' | 'location'>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (!error && data) setSettings(data);
    };
    fetchSettings();
  }, []);

  if (!settings) return null;

  const getSocialHref = (platform: string, value: string | null) => {
    if (!value) return null;
    if (value.startsWith('http')) return value;
    const handle = value.replace('@', '');
    return platform === 'instagram' 
      ? `https://instagram.com/${handle}` 
      : `https://facebook.com/${handle}`;
  };

  const socialActions = [
    { key: 'instagram', href: getSocialHref('instagram', settings.instagram), icon: Instagram },
    { key: 'facebook', href: getSocialHref('facebook', settings.facebook_handle), icon: Facebook },
  ];

  const contactActions = [
    { key: 'email', label: 'Email', value: settings.email, icon: Mail },
    { key: 'phone', label: 'Phone', value: settings.phone, icon: Phone },
    { key: 'location', label: 'Studio', value: settings.contact_location, icon: MapPin },
  ];

  return (
    <footer className="bg-charcoal-deep border-t border-white/5 relative overflow-hidden">
      {/* Cinematic Top Border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col items-center">
        
        {/* 1. BRAND IDENTITY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center space-y-4 mb-12 w-full"
        >
          <Link to="/" className="group flex flex-col items-center w-full">
            {settings.logo_url ? (
              <div className="flex justify-center w-full">
                <img
                  src={settings.logo_url}
                  alt="Logo"
                  className="h-20 w-auto mb-6 transition-all duration-1000 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(214,179,92,0.15)] mx-auto"
                />
              </div>
            ) : (
              <Aperture className="w-12 h-12 text-primary mb-4 mx-auto" />
            )}
            <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] text-foreground uppercase font-light">
              {settings.brand_name || 'Santosh'}
            </h2>
            <div className="flex items-center gap-4 w-full max-w-md mt-2">
               <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
               <span className="text-[10px] tracking-[0.6em] uppercase text-primary font-bold">Photography</span>
               <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-primary/30 to-transparent" />
            </div>
          </Link>
          <p className="text-sm md:text-base text-muted-foreground/60 max-w-lg leading-relaxed italic mt-4 font-serif">
            "{settings.brand_tagline}"
          </p>
        </motion.div>

        {/* 2. CONNECT BAR */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6 mb-16"
        >
          <h4 className="text-[9px] tracking-[0.5em] uppercase text-muted-foreground/40 font-bold">Connect With Us</h4>
          
          <div className="flex items-center gap-3 sm:gap-4 bg-card/30 border border-border/20 p-2 rounded-full backdrop-blur-md shadow-2xl">
            
            {socialActions.map(({ key, href, icon: Icon }) => (
              <motion.a
                key={key}
                href={href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-primary/10 group ${!href && 'opacity-10 pointer-events-none'}`}
              >
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.a>
            ))}

            <div className="w-[1px] h-6 bg-border/30 mx-1" />

            {contactActions.map(({ key, label, value, icon: Icon }) => (
              <div key={key} className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTooltip(activeTooltip === key ? null : (key as any))}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeTooltip === key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-primary/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {activeTooltip === key && value && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, x: '-50%' }}
                      animate={{ opacity: 1, y: -12, x: '-50%' }}
                      exit={{ opacity: 0, y: 10, x: '-50%' }}
                      className="absolute bottom-full left-1/2 z-50 pointer-events-none"
                    >
                      <div className="bg-card border border-border/30 px-4 py-2 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] whitespace-nowrap">
                        <span className="block text-[7px] uppercase tracking-widest text-primary font-bold mb-0.5">{label}</span>
                        <span className="text-[11px] text-foreground/90 font-medium">{value}</span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-border/30" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3. FOOTNOTE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full pt-8 border-t border-border/20 flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-8 text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40">
            <Link to="/portfolio" className="hover:text-primary transition-colors duration-300">Portfolio</Link>
            <Link to="/about" className="hover:text-primary transition-colors duration-300">About</Link>
            <Link to="/services" className="hover:text-primary transition-colors duration-300">Services</Link>
          </div>
          <p className="text-[7px] uppercase tracking-[0.4em] text-muted-foreground/20">
            © {new Date().getFullYear()} {settings.brand_name} Studio — All Rights Reserved
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
