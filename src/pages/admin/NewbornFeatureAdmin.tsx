import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  Upload,
  RotateCcw,
  Save,
  Loader2,
  Type,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  processImage,
  uploadProcessedImage,
} from "@/lib/imageProcessing";

/* ----------------------------------------
   Types
---------------------------------------- */

type NewbornFeature = {
  id: number;
  eyebrow_text: string | null;
  headline_base: string | null;
  headline_highlight: string | null;
  description_1: string | null;
  description_2: string | null;
  image_url: string | null;
  image_preview_url: string | null;
};

export default function NewbornFeatureAdmin() {
  const [data, setData] = useState<NewbornFeature | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hiLoaded, setHiLoaded] = useState(false);

  // 🔥 instant local preview
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- DATA ---------------- */

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data } = await supabase
      .from("newborn_feature")
      .select("*")
      .single();

    if (data) setData(data);
    setLoading(false);
  };

  /* ---------------- IMAGE ---------------- */

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;

    setUploading(true);
    setHiLoaded(false);

    try {
      // 1️⃣ Process image (resize + compress + preview)
      const processed = await processImage(file, {
        maxWidth: 2200,
        maxHeight: 2200,
        quality: 0.75,
        maxFileSizeMB: 25,
      });

      // 2️⃣ Show instant preview
      setLocalPreview(processed.previewUrl);

      // 3️⃣ Upload optimized image
      const path = `newborn/${Date.now()}.jpg`;
      const publicUrl = await uploadProcessedImage(
        supabase,
        "media",
        path,
        processed.uploadBlob
      );

      // 4️⃣ Update local state (no DB save yet)
      setData({
        ...data,
        image_url: publicUrl,
        image_preview_url: publicUrl,
      });
    } catch (err: any) {
      alert(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- SAVE ---------------- */

  const save = async () => {
    if (!data) return;
    setSaving(true);

    const { error } = await supabase
      .from("newborn_feature")
      .update(data)
      .eq("id", data.id);

    if (error) alert("Update failed: " + error.message);
    else alert("Newborn Feature Updated");

    setSaving(false);
  };

  if (loading)
    return (
      <Loader2 className="animate-spin mx-auto mt-20 text-primary" />
    );

  /* ---------------- RENDER ---------------- */

  return (
    <section className="text-foreground">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-white/10" />
        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary/80">
          Newborn Feature
        </h2>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* ---------- MAIN CARD ---------- */}
      <motion.div
        layout
        className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 backdrop-blur-sm space-y-12"
      >
        {/* ---------- COPY ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 font-serif">
              <Type size={18} className="text-primary" /> Copywriting
            </h3>

            {[
              ["Eyebrow Text", "eyebrow_text"],
              ["Headline Base", "headline_base"],
              ["Headline Highlight", "headline_highlight"],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="text-[10px] uppercase tracking-widest text-white/40">
                  {label}
                </label>
                <input
                  className="bg-black/20 border border-white/5 rounded-xl px-4 py-3 w-full text-sm outline-none focus:border-primary/50"
                  value={(data as any)[key] || ""}
                  onChange={e =>
                    setData({ ...data, [key]: e.target.value } as NewbornFeature)
                  }
                />
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {["description_1", "description_2"].map((key, i) => (
              <div key={key}>
                <label className="text-[10px] uppercase tracking-widest text-white/40">
                  Paragraph {i + 1}
                </label>
                <textarea
                  rows={4}
                  className="bg-black/20 border border-white/5 rounded-xl px-4 py-3 w-full text-sm resize-none outline-none focus:border-primary/50"
                  value={(data as any)[key] || ""}
                  onChange={e =>
                    setData({ ...data, [key]: e.target.value } as NewbornFeature)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* ---------- IMAGE UPLOAD ---------- */}
        <div>
          <h3 className="flex items-center gap-2 font-serif mb-4">
            <ImageIcon size={18} className="text-primary" /> Feature Image
          </h3>

          <div className="relative group w-full max-w-md h-56">
            {(localPreview || data.image_preview_url || data.image_url) ? (
              <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10">
                {(localPreview || data.image_preview_url) && (
                  <img
                    src={localPreview || data.image_preview_url!}
                    className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
                  />
                )}

                {data.image_url && (
                  <img
                    src={data.image_url}
                    onLoad={() => setHiLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      hiLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-white text-black p-2 rounded-full hover:scale-110 transition"
                  >
                    {uploading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <RotateCcw size={16} />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <label
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 h-full rounded-2xl border-2 border-dashed border-white/10 bg-black/20 text-white/30 hover:border-primary/40 hover:text-primary transition cursor-pointer"
              >
                <Upload size={20} />
                <span className="text-[10px] uppercase font-bold tracking-widest">
                  Upload Image
                </span>
              </label>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* ---------- SAVE ---------- */}
        <button
          onClick={save}
          disabled={saving}
          className="w-full h-16 bg-primary text-black font-bold uppercase tracking-[0.2em] rounded-full hover:scale-[1.02] active:scale-95 transition disabled:opacity-40 flex items-center justify-center gap-3"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={16} />}
          Update Newborn Feature
        </button>
      </motion.div>
    </section>
  );
}


