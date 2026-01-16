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
    <div className="min-h-screen bg-charcoal-deep text-foreground font-sans selection:bg-primary/30">
      {/* GLOBAL ADMIN HEADER */}
      <header className="border-b border-white/5 px-8 py-5 flex items-center justify-between bg-black/20 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.5em] uppercase text-primary/70 font-bold ml-1">
            System Admin
          </span>
          <h1 className="text-2xl font-serif tracking-tight text-white italic">
            Management <span className="not-italic font-sans font-light opacity-50 text-sm tracking-[0.2em] uppercase ml-2">Portal</span>
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all"
        >
          <span className="h-px w-6 bg-white/10 group-hover:bg-primary group-hover:w-10 transition-all duration-500" />
          Logout Session
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <AdminDashboard />
      </main>
    </div>
  );
}

