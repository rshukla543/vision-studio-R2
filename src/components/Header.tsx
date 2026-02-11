import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';

import Logo from '@/assets/logo.png';
import Strip from '@/assets/strip.png';

const EASE = cubicBezier(0.22, 1, 0.36, 1);

const menuItemVariants = {
  hidden: { opacity: 0, x: -30, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { delay: i * 0.08 + 0.15, duration: 0.5, ease: EASE },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = 'unset';
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = !menuOpen ? 'hidden' : 'unset';
  };

  const linkBase = 'relative group text-[14px] md:text-[15px] font-semibold tracking-[0.35em] uppercase transition-all duration-500 ease-out';
  const gold = 'text-primary hover:text-gold-light';
  const active = 'text-gold-light';

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={cn(linkBase, gold, location.pathname === to && active, "hover:scale-105 active:scale-95")}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-gold-light to-transparent transition-all duration-500 group-hover:w-full" />
    </Link>
  );

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Portfolio', to: '/portfolio' },
    { name: 'Services', to: '/services' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-700",
      scrolled || menuOpen ? "py-2" : "bg-transparent py-4"
    )}>
      <div className="relative h-[80px] md:h-[110px] flex items-center justify-center px-6">
        
        {/* STRIP MASK */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-[80px] my-auto pointer-events-none transition-all duration-1000 hidden lg:block",
            scrolled || menuOpen ? "bg-background/80 backdrop-blur-md opacity-100 scale-x-110" : "opacity-20 scale-x-100"
          )}
          style={{
            backgroundImage: `url(${Strip})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            WebkitMaskImage: 'radial-gradient(circle, transparent 120px, black 250px)',
            maskImage: 'radial-gradient(circle, transparent 120px, black 250px)',
          }}
        />

        {/* Desktop Navigation */}
        <nav className="hidden lg:grid relative w-full h-full grid-cols-[1fr_auto_1fr] items-center px-10 max-w-7xl">
          <div className="flex justify-evenly items-center">
            <NavLink to="/portfolio">Portfolio</NavLink>
            <NavLink to="/services">Services</NavLink>
          </div>

          <div className="relative px-12 group">
            <div className="absolute inset-0 bg-primary opacity-10 blur-3xl rounded-full scale-75 group-hover:scale-125 group-hover:opacity-30 transition-all duration-1000 animate-pulse" />
            <Link to="/" aria-label="Home" className="relative z-10 block">
              <img
                src={Logo}
                alt="Logo"
                className="h-20 md:h-28 transition-all duration-700 group-hover:scale-110 group-hover:drop-shadow-[0_0_40px_rgba(214,179,92,0.8)]"
              />
            </Link>
          </div>

          <div className="flex justify-evenly items-center">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
        </nav>

        {/* MOBILE HEADER */}
        <div className="lg:hidden w-full flex items-center justify-between z-[110]">
           <div className="w-10" />
           <Link to="/" className="relative group active:scale-90 transition-all duration-500">
              <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-full scale-90 animate-pulse" />
              <img 
                src={Logo} 
                alt="Logo" 
                className="relative h-16 md:h-20 drop-shadow-[0_0_15px_rgba(214,179,92,0.4)]" 
              />
           </Link>

           <motion.button
            onClick={toggleMenu}
            whileTap={{ scale: 0.9, rotate: 90 }}
            className="text-primary p-2"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </motion.button>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden fixed inset-0 bg-background/98 backdrop-blur-2xl z-[90]"
          >
            <nav className="flex flex-col items-start justify-center h-full px-12 gap-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  custom={i}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link
                    to={link.to}
                    className={cn(
                      "group flex items-center gap-4 text-primary text-xl font-bold tracking-[0.2em] uppercase transition-all duration-500",
                      location.pathname === link.to && "text-gold-light"
                    )}
                  >
                    <ChevronRight size={18} className="text-gold-light opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                    <span className="relative z-10 group-hover:text-gold-light transition-colors">{link.name}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
