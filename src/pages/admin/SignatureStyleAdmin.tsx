import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Type, Hash, ImagePlus, Sparkles } from "lucide-react";
import { processImage, uploadProcessedImage } from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";
import { useAdminToast } from "@/components/admin/AdminToast";

/* ----------------------------------------
   Types
---------------------------------------- */

type SignatureStyle = {
  id: number;
  title_line_1: string | null;
  title_highlight: string | null;
  description_1: string | null;
  description_2: string | null;
  stat_1_value: string | null;
  stat_1_label: string | null;
  stat_2_value: string | null;
  stat_2_label: string | null;
  stat_3_value: string | null;
  stat_3_label: string | null;
  image_url: string | null;
  image_preview_url: string | null;
};

export default function SignatureStyleAdmin() {
  const { showToast } = useAdminToast();
  const [data, setData] = useState<SignatureStyle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hiLoaded, setHiLoaded] = useState(false);

  // 🔥 instant local preview
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- DATA ---------------- */

  useEffect(() => {
    fetchStyle();
  }, []);

  const fetchStyle = async () => {
    const { data } = await supabase
      .from("signature_style")
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
      const processed = await processImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.75,
        maxFileSizeMB: 25,
      });

      // instant UI feedback
      setLocalPreview(processed.previewUrl);

      const path = `signature/${Date.now()}.jpg`;
      const publicUrl = await uploadProcessedImage(
        supabase,
        "media",
        path,
        processed.uploadBlob,
      );

      setData({
        ...data,
        image_url: publicUrl,
        image_preview_url: publicUrl,
      });
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- SAVE ---------------- */

  const save = async () => {
    if (!data) return;
    setSaving(true);

    const updates = {
      title_line_1: data.title_line_1,
      title_highlight: data.title_highlight,
      description_1: data.description_1,
      description_2: data.description_2,
      stat_1_value: data.stat_1_value,
      stat_1_label: data.stat_1_label,
      stat_2_value: data.stat_2_value,
      stat_2_label: data.stat_2_label,
      stat_3_value: data.stat_3_value,
      stat_3_label: data.stat_3_label,
      image_url: data.image_url,
      image_preview_url: data.image_preview_url,
    };

    const { error } = await supabase
      .from("signature_style")
      .update(updates)
      .eq("id", data.id);

    if (error) {
      showToast("Update failed: " + error.message, "error");
    } else {
      showToast("Signature style updated successfully");
    }

    setSaving(false);
  };

  if (loading) {
    return <Loader2 className="animate-spin mx-auto mt-20" />;
  }

  /* ---------------- RENDER ---------------- */

  return (
    <section className="mt-20 p-6 max-w-5xl mx-auto space-y-8">
      <div className="mb-12">
        <span className="text-xs tracking-[0.4em] uppercase text-primary font-bold">
          Editorial CMS
        </span>
        <h2 className="text-4xl font-serif mt-2 italic">
          Signature <span className="not-italic">Style</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* -------- Narrative Content -------- */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Type className="text-primary" size={18} />
            <h3 className="font-serif">Narrative Content</h3>
          </div>

          <div className="space-y-4">
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
              value={data.title_line_1 || ""}
              onChange={e =>
                setData({ ...data, title_line_1: e.target.value })
              }
            />

            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm italic"
              value={data.title_highlight || ""}
              onChange={e =>
                setData({ ...data, title_highlight: e.target.value })
              }
            />

            <textarea
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
              value={data.description_1 || ""}
              onChange={e =>
                setData({ ...data, description_1: e.target.value })
              }
            />

            <textarea
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm italic"
              value={data.description_2 || ""}
              onChange={e =>
                setData({ ...data, description_2: e.target.value })
              }
            />
          </div>
        </div>

        {/* -------- Stats + Image -------- */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Hash className="text-primary" size={18} />
            <h3 className="font-serif">The Numbers</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3].map(num => (
              <div key={num}>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs"
                  value={(data as any)[`stat_${num}_value`] || ""}
                  onChange={e =>
                    setData({
                      ...data,
                      [`stat_${num}_value`]: e.target.value,
                    } as SignatureStyle)
                  }
                />
                <input
                  className="w-full mt-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs"
                  value={(data as any)[`stat_${num}_label`] || ""}
                  onChange={e =>
                    setData({
                      ...data,
                      [`stat_${num}_label`]: e.target.value,
                    } as SignatureStyle)
                  }
                />
              </div>
            ))}
          </div>

          {/* -------- Progressive Image Preview -------- */}
          <div className="pt-6 border-t border-white/5">
            <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold block mb-3">
              Signature Image
            </label>
            <div className="relative">
              {/* IMAGE WELL */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative w-full aspect-square cursor-pointer overflow-hidden rounded-2xl",
                  // "relative w-full aspect-square max-w-[260px] cursor-pointer overflow-hidden rounded-2xl",
                  "bg-white/5 border border-white/10",
                  "group transition-all hover:border-primary/40"
                )}
              >
                {/* Preview */}
                {(localPreview || data.image_preview_url) && (
                  <img
                    src={localPreview || data.image_preview_url!}
                    className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-70"
                  />
                )}

                {/* Hi-res */}
                {data.image_url && (
                  <img
                    src={data.image_url}
                    onLoad={() => setHiLoaded(true)}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                      hiLoaded ? "opacity-100" : "opacity-0"
                    )}
                  />
                )}

                {/* Darken layer */}
                <div className="absolute inset-0 bg-black/30 opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Upload overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3 pointer-events-none">
                  {uploading ? (
                    <Loader2 className="animate-spin text-white/80" size={22} />
                  ) : (
                    <>
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur">
                        <ImagePlus size={20} className="text-white" />
                      </div>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-white/80">
                        Replace Image
                      </span>
                    </>
                  )}
                </div>

                {/* Subtle inner frame */}
                <div className="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />
              </div>

              {/* Hidden input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={save}
        disabled={saving}
        className="w-full h-14 bg-primary text-black font-bold uppercase tracking-[0.2em] rounded-xl"
      >
        {saving ? (
          <Loader2 className="animate-spin mr-2" />
        ) : (
          <Save className="mr-2" size={18} />
        )}
        Publish Signature Style Changes
      </Button>
    </section>
  );
}



