import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import AdminDashboard from "./AdminDashboard";
import { motion } from "framer-motion";

export default function AdminLayout() {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    isAdmin().then(setAllowed);
  }, []);

  if (allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-deep text-primary">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-xs uppercase tracking-[0.5em] font-bold"
        >
          Authenticating Session...
        </motion.div>
      </div>
    );
  }

  if (!allowed) return <Navigate to="/admin/login" />;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
  

// ... inside your component ...

<div className="min-h-screen bg-[#050505] text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
  {/* AMBIENT BACKGROUND DECOR - Soft animated mesh */}
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute -top-10 -left-16 w-[60vw] h-[60vw] bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-[140px] rounded-full animate-pulse" />
    <div className="absolute top-1/3 right-[-20%] w-[55vw] h-[55vw] bg-gradient-to-bl from-white/10 via-primary/5 to-transparent blur-[160px] rounded-full animate-[spin_50s_linear_infinite]" />
    <div className="absolute bottom-[-10%] left-[10%] w-[50vw] h-[50vw] bg-gradient-to-tr from-primary/10 via-white/5 to-transparent blur-[140px] rounded-full animate-[pulse_14s_ease-in-out_infinite]" />
  </div>

  {/* GLOBAL ADMIN HEADER */}
  <header className="border-b border-white/5 px-4 sm:px-6 md:px-12 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-black/60 backdrop-blur-2xl sticky top-0 z-[100] rounded-b-3xl">
    <motion.div 
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 min-w-0"
    >
      <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner shadow-black/40">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[9px] tracking-[0.5em] uppercase text-primary font-semibold">
          Control Center
        </span>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-tight text-white">
          Admin <span className="italic text-primary/80">Suite</span>
        </h1>
      </div>
    </motion.div>

    <motion.button
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ gap: "14px" }}
      onClick={handleLogout}
      className="group flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-white/60 hover:text-white transition-all duration-500 ease-out bg-white/5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/10 hover:border-primary/40 hover:bg-primary/5 flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
    >
      <span className="font-bold hidden sm:inline">Logout</span>
      <span className="font-bold sm:hidden">Exit</span>
      <div className="relative flex items-center justify-center">
        <div className="h-[1px] w-3 sm:w-4 bg-white/20 group-hover:bg-primary group-hover:w-6 sm:group-hover:w-8 transition-all duration-500" />
        <div className="absolute right-0 h-1 w-1 bg-white/20 rounded-full group-hover:bg-primary" />
      </div>
    </motion.button>
  </header>

  {/* MAIN CONTENT AREA */}
  <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-10 md:py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      <AdminDashboard />
    </motion.div>
  </main>
  
  {/* FOOTER DETAIL */}
  <footer className="border-t border-white/5 py-10 text-center opacity-20">
    <p className="text-[10px] uppercase tracking-[0.5em]">Secure Admin Access Only</p>
  </footer>
</div>

  );
}

