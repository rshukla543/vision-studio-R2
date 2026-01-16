import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-deep px-6">
      <div className="relative w-full max-w-md">

        {/* Soft glow */}
        <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-2xl" />

        <div className="relative bg-charcoal border border-border/40 rounded-2xl p-10 backdrop-blur-md shadow-[0_0_60px_rgba(214,179,92,0.18)]">
        {/* <div className="relative bg-charcoal border border-border/40 rounded-2xl p-10 backdrop-blur-md shadow-2xl"> */}
                    
          {/* Header */}
          <div className="text-center mb-10 space-y-3">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full border border-primary/40">
              <Lock className="w-5 h-5 text-primary" />
            </div>

            <h1 className="font-serif text-3xl text-foreground tracking-wide">
              Admin Access
            </h1>

            <p className="text-sm text-muted-foreground">
              Authorized personnel only
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                  className="
                    w-full pl-10 pr-4 py-3
                    bg-charcoal-deep
                    border border-border/50
                    rounded-lg
                    text-foreground
                    placeholder-muted-foreground
                    focus:outline-none
                    focus:border-primary
                    focus:ring-1 focus:ring-primary/40
                    transition
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="
                    w-full pl-10 pr-4 py-3
                    bg-charcoal-deep
                    border border-border/50
                    rounded-lg
                    text-foreground
                    placeholder-muted-foreground
                    focus:outline-none
                    focus:border-primary
                    focus:ring-1 focus:ring-primary/40
                    transition
                  "
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-400 text-center border border-red-400/30 bg-red-400/5 py-2 rounded-md">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full mt-6 py-3 rounded-lg
                bg-primary text-charcoal-deep
                font-semibold tracking-wide
                hover:bg-primary/90
                transition
                disabled:opacity-60
                flex items-center justify-center
              "
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Enter Dashboard"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition"
            >
              ← Back to Website
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
