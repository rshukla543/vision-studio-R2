import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react'; // Added ChevronRight
import { cn } from '@/lib/utils';

import Logo from '@/assets/logo.png';
import Strip from '@/assets/strip.png';

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
  const gold = 'text-[#d6b35c] hover:text-[#f5d98a]';
  const active = 'text-[#f5d98a]';

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={cn(linkBase, gold, location.pathname === to && active, "hover:scale-110 active:scale-95")}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-[#f5d98a] to-transparent transition-all duration-500 group-hover:w-full group-hover:drop-shadow-[0_0_8px_#f5d98a]" />
    </Link>
  );

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
            scrolled || menuOpen ? "bg-black/40 opacity-90 scale-x-110" : "opacity-20 scale-x-100"
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
            <div className="absolute inset-0 bg-[#d6b35c] opacity-10 blur-3xl rounded-full scale-75 group-hover:scale-125 group-hover:opacity-30 transition-all duration-1000 animate-pulse" />
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
              <div className="absolute inset-0 bg-[#d6b35c] opacity-20 blur-2xl rounded-full scale-90 animate-pulse" />
              <img 
                src={Logo} 
                alt="Logo" 
                className="relative h-16 md:h-20 drop-shadow-[0_0_15px_rgba(214,179,92,0.4)]" 
              />
           </Link>

           <button
            onClick={toggleMenu}
            className="text-[#d6b35c] p-2 hover:scale-110 transition-transform active:rotate-90 duration-300"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU PANEL - FIXED SECTION */}
      <div className={cn(
        "lg:hidden fixed inset-0 bg-black/95 backdrop-blur-3xl transition-all duration-700 ease-in-out z-[90]",
        menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}>
        <div className='flex justify-center items-center h-full'>
        <nav className="flex flex-col items-start justify-center h-full px-12 gap-8">
          {['Home', 'Portfolio', 'Services', 'About', 'Contact'].map((name, i) => (
            <Link
              key={name}
              to={`/${name.toLowerCase()}`}
              className={cn(
                "group flex items-center gap-4 text-[#d6b35c] text-lg font-bold tracking-[0.2em] uppercase transition-all duration-700",
                menuOpen ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              )}
              style={{ transitionDelay: `${menuOpen ? i * 100 + 200 : 0}ms` }}
            >
              {/* Left Side Icon */}
              <ChevronRight size={18} className="text-[#f5d98a] opacity-50 group-hover:translate-x-1 transition-transform" />
              
              <span className="relative z-10 group-active:text-white transition-colors">{name}</span>
              
              {/* Subtle underline */}
              <span className="absolute -bottom-2 left-8 w-0 h-[1px] bg-[#f5d98a]/30 transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>
        </div>
      </div>
    </header>
  );
}

