import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  Image as ImageIcon,
  Type,
  Quote,
  PencilLine,
} from "lucide-react";

import {
  processImage,
  uploadProcessedImage,
} from "@/lib/imageProcessing";

type AboutContent = {
  id: string;
  singleton_key: number;

  eyebrow_text: string | null;
  headline: string | null;
  highlighted_word: string | null;

  body_paragraph_1: string | null;
  body_paragraph_2: string | null;

  quote_text: string | null;

  portrait_image_url: string | null;
  portrait_image_preview_url: string | null;

  weddings_label: string | null;
  weddings_count: string | null;
  experience_label: string | null;
  experience_years: string | null;
};

export default function AboutContentAdmin() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hiLoaded, setHiLoaded] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const inputStyles = `
    w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 
    text-white placeholder:text-white/20 outline-none transition-all duration-300
    focus:border-primary/50 focus:ring-1 focus:ring-primary/30 focus:bg-black/40
  `;

  /* ---------------- INIT (singleton auto-heal) ---------------- */

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("about_content")
      .select("*")
      .eq("singleton_key", 1)
      .limit(1);

    if (data && data.length > 0) {
      setContent(data[0]);
    } else {
      const { data: inserted } = await supabase
        .from("about_content")
        .insert({ singleton_key: 1 })
        .select()
        .single();
      setContent(inserted);
    }
    setLoading(false);
  };

  /* ---------------- IMAGE UPLOAD ---------------- */

  const handleUpload = async (file: File) => {
    if (!content) return;
    setUploading(true);
    setHiLoaded(false);

    try {
      const processed = await processImage(file, {
        maxWidth: 2400,
        maxHeight: 2400,
        quality: 0.75,
        maxFileSizeMB: 25,
      });

      setLocalPreview(processed.previewUrl);

      const base = `about/${Date.now()}`;
      const hiUrl = await uploadProcessedImage(
        supabase,
        "media",
        `${base}.jpg`,
        processed.uploadBlob
      );
      const previewUrl = await uploadProcessedImage(
        supabase,
        "media",
        `${base}-preview.jpg`,
        processed.previewBlob
      );

      setContent({
        ...content,
        portrait_image_url: hiUrl,
        portrait_image_preview_url: previewUrl,
      });
    } finally {
      setUploading(false);
    }
  };

  const update = (key: keyof AboutContent, value: string) =>
    setContent(c => (c ? { ...c, [key]: value } : c));

  const save = async () => {
    if (!content) return;
    setSaving(true);
    await supabase.from("about_content").update(content).eq("singleton_key", 1);
    setSaving(false);
    alert("About section updated successfully!");
  };

  if (loading) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-primary" />
      </div>
    );
  }
  return (
    <section className="mt-20 p-6 max-w-6xl mx-auto space-y-16">

      {/* HEADER */}
      <div>
        <span className="text-xs tracking-[0.4em] uppercase text-primary font-bold">
          About CMS
        </span>
        <h2 className="text-4xl md:text-5xl font-serif mt-2 text-foreground font-light italic">
          About <span className="text-white not-italic">Content</span>
        </h2>
        <div className="h-px w-20 bg-primary mt-4 opacity-50" />
      </div>

      <div className="grid lg:grid-cols-12 gap-14">

        {/* LEFT – IMAGE */}
        <div className="lg:col-span-5 space-y-8">
          <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold flex items-center gap-2">
            <ImageIcon size={14} /> Main Portrait
          </label>

          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            {(localPreview || content?.portrait_image_preview_url) && (
              <img
                src={localPreview || content!.portrait_image_preview_url!}
                className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
              />
            )}

            {content?.portrait_image_url && (
              <img
                src={content.portrait_image_url}
                onLoad={() => setHiLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${hiLoaded ? "opacity-100" : "opacity-0"
                  }`}
              />
            )}

            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition flex items-center justify-center">
              <Button
                variant="secondary"
                onClick={() => fileRef.current?.click()}
              >
                Replace Image
              </Button>
            </div>

            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            )}
          </div>
          {/* EXPERIENCE HIGHLIGHT */}
          <div className="pt-10">
            <div
              className="
      border border-primary/40
      rounded-2xl
      p-8
      bg-primary/5
      text-center
      space-y-1
    "
            >
              <input
                className="
        bg-transparent
        border-b border-primary/30
        w-full
        text-center
        text-primary
        font-serif
        text-lg
        outline-none
        tracking-wide
      "
                value={content?.experience_label || ""}
                onChange={e => update('experience_label', e.target.value)}
              />

              <input
                className="
        bg-transparent
        w-full
        text-center
        text-4xl
        md:text-5xl
        font-serif
        outline-none
        text-white
        leading-tight
      "
                value={content?.experience_years || ''}
                onChange={e => update('experience_years', e.target.value)}
              />
            </div>
          </div>
          <div className="pt-10">
            <div
              className="
      border border-primary/40
      rounded-2xl
      p-8
      bg-primary/5
      text-center
      space-y-1
    "
            >
              <input
                className="
        bg-transparent
        border-b border-primary/30
        w-full
        text-center
        text-primary
        font-serif
        text-lg
        outline-none
        tracking-wide
      "
                value={content?.weddings_label || ""}
                onChange={e => update("weddings_label", e.target.value)}
              />

              <input
                className="
        bg-transparent
        w-full
        text-center
        text-4xl
        md:text-5xl
        font-serif
        outline-none
        text-white
        leading-tight
      "
                value={content?.weddings_count || ""}
                onChange={e => update("weddings_count", e.target.value)}
              />
            </div>
          </div>


          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e =>
              e.target.files && handleUpload(e.target.files[0])
            }
          />
        </div>

        {/* RIGHT – CONTENT */}
        <div className="lg:col-span-7 space-y-12">

          {/* HEADLINE */}
          <div className="space-y-6">
            {[
              ["Eyebrow Text", "eyebrow_text"],
              ["Main Headline", "headline"],
              ["Highlighted Word", "highlighted_word"],
            ].map(([label, key]) => (
              <div key={key} className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-primary/60 font-bold flex items-center gap-2">
                  <PencilLine size={12} /> {label}
                </label>
                <input
                  className={inputStyles}
                  value={(content as any)[key] || ""}
                  onChange={e => update(key as any, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* STORY */}
          <div className="space-y-8 pt-10 border-t border-white/10">
            {[
              ["Story Paragraph I", "body_paragraph_1"],
              ["Story Paragraph II", "body_paragraph_2"],
            ].map(([label, key]) => (
              <div key={key} className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-primary/60 font-bold flex items-center gap-2">
                  <PencilLine size={12} /> {label}
                </label>
                <textarea
                  rows={4}
                  className={`${inputStyles} resize-none scrollbar-hidden leading-relaxed px-5 py-5 scroll-py-4`}
                  value={(content as any)[key] || ""}
                  onChange={e => update(key as any, e.target.value)}
                />
              </div>
            ))}
          </div>
          {/* QUOTE */}
          <div className="pt-10 border-t border-white/10 space-y-3 text-center">
            <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold flex items-center justify-center gap-2">
              <Quote size={12} /> Quote
            </label>
            <textarea
              rows={3}
              className={`${inputStyles} italic text-lg text-center resize-none scrollbar-hidden bg-primary/5 border-primary/20 px-6 py-6 scroll-py-4`}
              value={content?.quote_text || ""}
              onChange={e => update("quote_text", e.target.value)}
            />
          </div>

        </div>
      </div>



      {/* SAVE */}
      <div className="pt-10 flex justify-center">
        <Button
          onClick={save}
          disabled={saving}
          className="w-full md:w-auto px-16 h-[60px] bg-primary text-black hover:bg-primary/80 font-bold uppercase tracking-[0.3em] text-[12px] rounded-full flex items-center gap-3 transition-all shadow-xl shadow-primary/10"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
          {saving ? "Deploying..." : "Update About Section"}
        </Button>
      </div>

    </section>
  );

}
