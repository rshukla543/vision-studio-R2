import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Upload,
  Plus,
  RotateCcw,
  Check,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImageWithVariants } from "@/lib/imageUploadService";
import { AdminSectionHeader } from "@/components/admin/SectionHeader";
import { AdminSectionCard } from "@/components/admin/SectionCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { useAdminToast } from "@/components/admin/AdminToast";

/* ---------------- TYPES ---------------- */
type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  preview_image_url: string | null;
};

/* ---------------- EASING ---------------- */
const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HeroSlidesAdmin() {
  const { showToast } = useAdminToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  /* ---------------- DATA ---------------- */
  const fetchSlides = async () => {
    const { data } = await supabase
      .from("hero_slides")
      .select("*")
      .order("order_index");
    setSlides(data || []);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  /* ---------------- IMAGE ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  /* ---------------- CRUD ---------------- */
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setDescription("");
    setImage(null);
    setPreviewUrl(null);
  };

  const startEdit = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setDescription(slide.description);
    setPreviewUrl(slide.preview_image_url || slide.image_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveSlide = async () => {
    try {
      setIsUploading(true);
      let imageUrl = previewUrl;
      let previewImageUrl = previewUrl;

      if (image) {
        const result = await uploadImageWithVariants({
          file: image,
          bucket: "hero",
          basePath: `hero-slide-${Date.now()}`,
        });
        imageUrl = result.imageUrl;
        previewImageUrl = result.previewUrl;
      }

      const slideData = {
        title,
        subtitle,
        description,
        image_url: imageUrl,
        preview_image_url: previewImageUrl,
      };

      if (editingId) {
        await supabase.from("hero_slides").update(slideData).eq("id", editingId);
      } else {
        await supabase.from("hero_slides").insert(slideData);
      }

      resetForm();
      fetchSlides();
      showToast(editingId ? "Slide updated successfully" : "New slide added to sequence");
    } catch (err) {
      console.error(err);
      showToast("Failed to save slide", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm("Are you sure? This will remove the slide from the hero sequence.")) return;
    try {
      await supabase.from("hero_slides").delete().eq("id", id);
      showToast("Slide removed from sequence");
      fetchSlides();
    } catch (err) {
      showToast("Failed to delete slide", "error");
    }
  };

  return (
    <section className="text-foreground max-w-7xl mx-auto">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-[11px] font-sans font-bold tracking-[0.5em] uppercase text-primary whitespace-nowrap">
          {editingId ? "Modify Cinematic Slide" : "Hero Sequence Orchestrator"}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
      </div>

      {/* ---------- FORM ---------- */}
      <motion.div
        layout
        className="relative overflow-hidden mb-20"
      >
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.06] rounded-[40px]" />
        <div className="absolute inset-0 backdrop-blur-2xl rounded-[40px]" />
        <div className="absolute inset-0 border border-white/10 rounded-[40px]" />
        
        {/* Glow effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <div className="relative p-10">
          {/* Form header badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <Film size={12} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                {editingId ? "Editing Mode" : "Create New Slide"}
              </span>
            </div>
          </div>
        
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Inputs */}
            <div className="lg:col-span-7 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Title</label>
                  <input
                    className="bg-white/[0.06] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-primary/50 focus:bg-white/[0.08] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] outline-none transition-all placeholder:text-white/20"
                    placeholder="The Grand Opening"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Subtitle</label>
                  <input
                    className="bg-white/[0.06] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-primary/50 focus:bg-white/[0.08] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] outline-none transition-all placeholder:text-white/20"
                    placeholder="Luxury Wedding Photography"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Narrative Description</label>
                <textarea
                  className="bg-white/[0.06] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-primary/50 focus:bg-white/[0.08] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] outline-none h-32 resize-none transition-all placeholder:text-white/20"
                  placeholder="Describe the mood and visual style..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Media Preview */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Media Canvas</label>
              <div className="relative group aspect-video lg:h-full">
                {previewUrl ? (
                  <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 shadow-inner">
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                      <label
                        htmlFor="hero-upload"
                        className="cursor-pointer bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <RotateCcw size={14} /> Replace
                      </label>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="hero-upload"
                    className="flex flex-col items-center justify-center gap-4 h-full rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.04] text-white/30 hover:border-primary/50 hover:bg-primary/[0.08] hover:text-primary transition-all duration-500 cursor-pointer group"
                  >
                    <div className="p-4 rounded-full bg-white/[0.08] group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                      <Upload size={24} />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Upload Master Asset</span>
                  </label>
                )}
                <input type="file" id="hero-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-12 pt-8 border-t border-white/10">
            <button
              onClick={saveSlide}
              disabled={!previewUrl || !title || isUploading}
              className="group relative flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-amber-500 text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] disabled:opacity-20 disabled:hover:shadow-none transition-all"
            >
              {isUploading ? "Uploading..." : editingId ? <><Check size={14} /> Commit Changes</> : <><Plus size={14} /> Add to Sequence</>}
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="text-white/40 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all text-[10px] uppercase tracking-[0.2em] font-bold"
              >
                Discard Edits
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ---------- SLIDES GRID ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {slides.map((slide, i) => (
            <motion.div
              key={slide.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: easeOutExpo }}
              className="group relative bg-[#0A0A0A] border border-white/5 rounded-[32px] overflow-hidden hover:border-primary/30 transition-all duration-500 shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={slide.preview_image_url || slide.image_url}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                
                {/* Overlay Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => startEdit(slide)}
                    className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-primary hover:border-primary/50 transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-red-500 hover:border-red-500/50 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-primary text-[9px] font-bold uppercase tracking-[0.3em] mb-1">{slide.subtitle}</p>
                  <h4 className="font-serif text-xl text-white tracking-tight leading-tight line-clamp-1">{slide.title}</h4>
                </div>
              </div>

              <div className="p-6">
                <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2 italic font-light">
                  "{slide.description}"
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
