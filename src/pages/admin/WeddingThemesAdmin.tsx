import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Type, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminToast } from "@/components/admin/AdminToast";
import { AdminSectionHeader } from "@/components/admin/SectionHeader";
import { AdminSectionCard } from "@/components/admin/SectionCard";
import { AdminButton } from "@/components/admin/AdminButton";

type WeddingThemesContent = {
  id: string;
  singleton_key: number;
  eyebrow_text: string | null;
  heading_base: string | null;
  heading_highlight: string | null;
  theme1_title: string | null;
  theme1_description: string | null;
  theme1_phase: string | null;
  theme2_title: string | null;
  theme2_description: string | null;
  theme2_phase: string | null;
  theme3_title: string | null;
  theme3_description: string | null;
  theme3_phase: string | null;
};

export default function WeddingThemesAdmin() {
  const { showToast } = useAdminToast();
  const [content, setContent] = useState<WeddingThemesContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const inputStyles = `
    w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 
    text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300
    focus:border-primary/50 focus:ring-1 focus:ring-primary/30
  `;

  const textAreaStyles = `
    ${inputStyles} resize-none leading-relaxed scrollbar-hidden
  `;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("wedding_themes_content")
      .select("*")
      .eq("singleton_key", 1)
      .limit(1);

    if (data && data.length > 0) {
      setContent(data[0] as WeddingThemesContent);
    } else {
      const { data: inserted } = await supabase
        .from("wedding_themes_content")
        .insert({ singleton_key: 1 })
        .select()
        .single();
      setContent(inserted as WeddingThemesContent);
    }
    setLoading(false);
  };

  const update = (key: keyof WeddingThemesContent, value: string) =>
    setContent((c) => (c ? { ...c, [key]: value } : c));

  const save = async () => {
    if (!content) return;
    setSaving(true);
    await supabase
      .from("wedding_themes_content")
      .update(content)
      .eq("singleton_key", 1);
    setSaving(false);
    showToast("Wedding Themes content updated successfully");
  };

  if (loading || !content) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-primary" size={32} />
      </div>
    );
  }

  return (
    <section className="text-foreground max-w-7xl mx-auto px-4 sm:px-6 space-y-12 md:space-y-16">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-6 mb-4">
        <h2 className="text-[11px] font-sans font-bold tracking-[0.5em] uppercase text-primary whitespace-nowrap">
          Wedding Themes CMS
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
      </div>

      <div className="mb-4">
        <h2 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] tracking-tight">
          Wedding <span className="italic opacity-30 font-light underline decoration-primary/20 underline-offset-8">Themes</span>
        </h2>
        <p className="text-muted-foreground mt-6 text-base tracking-wide max-w-xl leading-relaxed opacity-70">
          Control the copy used in the public “Wedding Themes” section, including the header
          and the three thematic cards.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* HEADER COPY */}
        <div className="lg:col-span-4 space-y-6 bg-[#0A0A0A] border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-2xl relative shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <Type className="text-primary" size={18} />
            <h3 className="font-serif text-white text-lg">Section Header</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-primary/70 font-bold">
                Eyebrow Text
              </label>
              <input
                className={inputStyles}
                placeholder="Three Pillars of a Wedding Story"
                value={content.eyebrow_text ?? ""}
                onChange={(e) => update("eyebrow_text", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-primary/70 font-bold">
                Heading Base
              </label>
              <input
                className={inputStyles}
                placeholder="The Rhythm of"
                value={content.heading_base ?? ""}
                onChange={(e) => update("heading_base", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-primary/70 font-bold">
                Heading Highlight
              </label>
              <input
                className={inputStyles}
                placeholder="Celebration"
                value={content.heading_highlight ?? ""}
                onChange={(e) => update("heading_highlight", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* THEMES */}
        <div className="lg:col-span-8 space-y-8">
          {[1, 2, 3].map((idx) => {
            const titleKey = `theme${idx}_title` as keyof WeddingThemesContent;
            const descKey = `theme${idx}_description` as keyof WeddingThemesContent;
            const phaseKey = `theme${idx}_phase` as keyof WeddingThemesContent;

            return (
              <div
                key={idx}
                className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-2xl relative shadow-2xl"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                  <Sparkles className="text-primary" size={18} />
                  <h3 className="font-serif text-white text-lg">
                    Theme {idx}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
                        Title
                      </label>
                      <input
                        className={inputStyles}
                        placeholder={idx === 1 ? "Ceremony" : idx === 2 ? "Celebration" : "Details"}
                        value={(content[titleKey] as string) ?? ""}
                        onChange={(e) => update(titleKey, e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
                        Phase Label
                      </label>
                      <input
                        className={inputStyles}
                        placeholder={idx === 1 ? "New Moon" : idx === 2 ? "Half Moon" : "Full Moon"}
                        value={(content[phaseKey] as string) ?? ""}
                        onChange={(e) => update(phaseKey, e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className={textAreaStyles}
                      placeholder={
                        idx === 1
                          ? "Sacred rituals, timeless traditions, and the essence of two souls becoming one."
                          : idx === 2
                            ? "Joy, laughter, and the vibrant energy of families coming together in love."
                            : "The intricate beauty of jewelry, decor, and moments often unseen."
                      }
                      value={(content[descKey] as string) ?? ""}
                      onChange={(e) => update(descKey, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="pt-4 flex justify-center">
        <Button
          onClick={save}
          disabled={saving}
          className="w-full md:w-auto px-16 h-[60px] bg-primary text-black hover:bg-primary/80 font-bold uppercase tracking-[0.3em] text-[12px] rounded-full flex items-center gap-3 transition-all shadow-xl shadow-primary/10"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : "Update Wedding Themes"}
        </Button>
      </div>
    </section>
  );
}

