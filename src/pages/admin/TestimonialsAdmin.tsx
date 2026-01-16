import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, User, Quote, Trash2, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------------------
   Image helpers (avatars)
---------------------------------------- */

async function compressAvatar(
  file: File,
  size = 160,
  quality = 0.7
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = size / Math.max(bitmap.width, bitmap.height);

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise(resolve =>
    canvas.toBlob(blob => resolve(blob!), "image/jpeg", quality)
  );
}

async function uploadTestimonialImage(file: File) {
  const base = `testimonials/${Date.now()}`;

  // hi-res
  const hiPath = `${base}.jpg`;
  await supabase.storage.from("testimonials").upload(hiPath, file, {
    upsert: true,
  });

  const hiUrl = supabase.storage
    .from("testimonials")
    .getPublicUrl(hiPath).data.publicUrl;

  // preview
  const previewBlob = await compressAvatar(file);
  const previewPath = `${base}-preview.jpg`;

  await supabase.storage.from("testimonials").upload(previewPath, previewBlob, {
    upsert: true,
    contentType: "image/jpeg",
  });

  const previewUrl = supabase.storage
    .from("testimonials")
    .getPublicUrl(previewPath).data.publicUrl;

  return { hiUrl, previewUrl };
}

/* ----------------------------------------
   Types
---------------------------------------- */

type Testimonial = {
  id: string;
  name: string;
  event: string;
  quote: string;
  image_url: string;
  image_preview_url: string | null;
};

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- DATA ---------------- */

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("id", { ascending: false });

    setItems(data || []);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  /* ---------------- CREATE ---------------- */

  const addTestimonial = async () => {
    if (!name || !event || !quote || !image) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const uploaded = await uploadTestimonialImage(image);

      await supabase.from("testimonials").insert({
        name,
        event,
        quote,
        image_url: uploaded.hiUrl,
        image_preview_url: uploaded.previewUrl,
      });

      setName("");
      setEvent("");
      setQuote("");
      setImage(null);
      fetchTestimonials();
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <section className="mt-20 p-6">

      {/* HEADER */}
      <div className="mb-12">
        <span className="text-xs tracking-[0.4em] uppercase text-primary font-bold">
          Kind Words
        </span>
        <h2 className="text-4xl md:text-5xl font-serif mt-2 italic">
          Client <span className="not-italic text-white">Stories</span>
        </h2>
        <div className="h-px w-20 bg-primary mt-4 opacity-50" />
      </div>

      {/* UPLOAD PANEL */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* IMAGE */}
          <div className="lg:col-span-3 flex flex-col items-center space-y-4">
            <input
              type="file"
              accept="image/*"
              id="testimonial-image"
              onChange={e => setImage(e.target.files?.[0] || null)}
              className="hidden"
            />

            <label
              htmlFor="testimonial-image"
              className={cn(
                "w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition",
                image
                  ? "border-primary bg-primary/5"
                  : "border-white/10 bg-white/5 text-white/40 hover:border-primary/50"
              )}
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload />
              )}
            </label>

            {image && (
              <button
                onClick={() => setImage(null)}
                className="absolute mt-[-110px] ml-[90px] bg-red-500 rounded-full p-1"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* FORM */}
          <div className="lg:col-span-9 space-y-6">
            <input
              placeholder="Client Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />
            <input
              placeholder="Event"
              value={event}
              onChange={e => setEvent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />
            <textarea
              placeholder="Client feedback..."
              value={quote}
              onChange={e => setQuote(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 resize-none"
            />

            <button
              onClick={addTestimonial}
              disabled={loading}
              className="px-12 h-12 bg-primary text-black rounded-xl font-bold flex items-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Check />}
              Publish Testimonial
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map(t => (
          <TestimonialCard key={t.id} t={t} refresh={fetchTestimonials} />
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------
   Card (progressive avatar)
---------------------------------------- */

function TestimonialCard({
  t,
  refresh,
}: {
  t: Testimonial;
  refresh: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 group">
      <div className="flex gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-primary/20">

          {t.image_preview_url && (
            <img
              src={t.image_preview_url}
              className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
            />
          )}

          <img
            src={t.image_url}
            onLoad={() => setLoaded(true)}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>

        <div>
          <h4 className="font-serif text-lg">{t.name}</h4>
          <p className="text-xs uppercase tracking-widest text-primary">
            {t.event}
          </p>
        </div>
      </div>

      <p className="italic text-sm text-white/60 line-clamp-4">
        "{t.quote}"
      </p>

      <div className="mt-6 flex justify-between items-center">
        <span className="text-[9px] uppercase text-white/20">Verified Client</span>
        <button
          onClick={() =>
            supabase.from("testimonials").delete().eq("id", t.id).then(refresh)
          }
          className="text-red-400/50 hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}


