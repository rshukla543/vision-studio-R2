import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <footer className="bg-charcoal-deep border-t border-white/5 relative overflow-hidden"> 
      {/* Cinematic Top Border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col items-center">
        
        {/* 1. BRAND IDENTITY (The Top Crown) */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <Link to="/" className="group flex flex-col items-center">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt="Logo"
                className="h-20 w-auto mb-6 transition-all duration-1000 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(214,179,92,0.15)]"
              />
            ) : (
              <Aperture className="w-12 h-12 text-primary mb-4" />
            )}
            <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] text-foreground uppercase font-light">
              {settings.brand_name || 'Santosh'}
            </h2>
            <div className="flex items-center gap-4 w-full mt-2">
               <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
               <span className="text-[10px] tracking-[0.6em] uppercase text-primary font-bold">Photography</span>
               <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>
          </Link>
          <p className="text-sm md:text-base text-muted-foreground/60 max-w-lg leading-relaxed italic mt-4 font-serif">
            "{settings.brand_tagline}"
          </p>
        </div>

        {/* 2. SOCIALS (The Connection) */}
        <div className="flex flex-col items-center space-y-6 mb-12">
          <h4 className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-bold">Connect With Us</h4>
          <div className="flex items-center gap-6">
            {settings.instagram && (
              <a
                href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 hover:border-primary bg-white/[0.02]"
              >
                <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-5 blur-md transition-opacity" />
                <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            )}
            {settings.facebook_handle && (
              <a
                href={`https://facebook.com/${settings.facebook_handle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 hover:border-primary bg-white/[0.02]"
              >
                <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-5 blur-md transition-opacity" />
                <Facebook className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            )}
          </div>
        </div>

        {/* 3. CONTACT GRID (Wide Symmetrical Layout) */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-8 md:gap-16 text-center mb-16">
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="group space-y-2">
              <span className="block text-[10px] tracking-[0.3em] uppercase text-primary/60 font-bold">Email</span>
              <span className="block text-sm text-muted-foreground group-hover:text-foreground transition-colors">{settings.email}</span>
            </a>
          )}
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="group space-y-2">
              <span className="block text-[10px] tracking-[0.3em] uppercase text-primary/60 font-bold">Inquiries</span>
              <span className="block text-sm text-muted-foreground group-hover:text-foreground transition-colors">{settings.phone}</span>
            </a>
          )}
          {settings.contact_location && (
            <div className="group space-y-2">
              <span className="block text-[10px] tracking-[0.3em] uppercase text-primary/60 font-bold">Location</span>
              <span className="block text-sm text-muted-foreground">{settings.contact_location}</span>
            </div>
          )}
        </div>

        {/* 4. FOOTNOTE */}
        <div className="w-full pt-8 border-t border-white/5 flex flex-col items-center gap-6">
          <div className="flex items-center gap-8 text-[9px] uppercase tracking-[0.3em] text-white/20">
            <Link to="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          </div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/10">
            © {new Date().getFullYear()} {settings.brand_name} Studio — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

