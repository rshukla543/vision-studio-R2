import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Quote, Trash2, Check, Loader2, X, Sparkles, CircleDashed, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminToast } from "@/components/admin/AdminToast";

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
  is_approved: boolean;
};

/* ----------------------------------------
   Storage Helpers
---------------------------------------- */
async function compressAvatar(file: File, size = 160, quality = 0.7): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = size / Math.max(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise(resolve => canvas.toBlob(blob => resolve(blob!), "image/jpeg", quality));
}

async function uploadTestimonialImage(file: File) {
  const base = `testimonials/${Date.now()}`;
  const hiPath = `${base}.jpg`;
  await supabase.storage.from("testimonials").upload(hiPath, file, { upsert: true });
  const hiUrl = supabase.storage.from("testimonials").getPublicUrl(hiPath).data.publicUrl;

  const previewBlob = await compressAvatar(file);
  const previewPath = `${base}-preview.jpg`;
  await supabase.storage.from("testimonials").upload(previewPath, previewBlob, { upsert: true, contentType: "image/jpeg" });
  const previewUrl = supabase.storage.from("testimonials").getPublicUrl(previewPath).data.publicUrl;

  return { hiUrl, previewUrl };
}

export default function TestimonialsAdmin() {
  const { showToast } = useAdminToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTestimonials = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("id", { ascending: false });
    setItems(data || []);
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const addTestimonial = async () => {
    if (!name || !event || !quote || !image) return alert("All fields are required");
    setLoading(true);
    try {
      const uploaded = await uploadTestimonialImage(image);
      await supabase.from("testimonials").insert({
        name, event, quote,
        image_url: uploaded.hiUrl,
        image_preview_url: uploaded.previewUrl,
        is_approved: true,
      });
      setName(""); setEvent(""); setQuote(""); setImage(null);
      fetchTestimonials();
      showToast("Testimonial added successfully");
    } catch (err: any) { 
      showToast("Upload failed: " + err.message, "error"); 
    }
    finally { setLoading(false); }
  };

  return (
    <section className="mt-20 p-6 max-w-7xl mx-auto text-white font-sans">
      <div className="mb-12">
        <span className="text-xs tracking-[0.5em] uppercase text-primary font-bold">Registry Control</span>
        <h2 className="text-5xl font-serif mt-2 italic">Client <span className="not-italic text-white">Archives</span></h2>
      </div>

      {/* UPLOAD PANEL */}
      <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] mb-20 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={100} /></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          <div className="lg:col-span-3 flex flex-col items-center">
            <input type="file" accept="image/*" id="testimonial-image" onChange={e => setImage(e.target.files?.[0] || null)} className="hidden" />
            <label htmlFor="testimonial-image" className={cn(
              "w-44 h-44 rounded-full border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-700 shadow-2xl",
              image ? "ring-2 ring-primary ring-offset-4 ring-offset-[#050505]" : "bg-white/5 hover:bg-white/10"
            )}>
              {image ? <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" /> : <Upload className="text-white/20" />}
            </label>
            {image && (
              <button onClick={() => setImage(null)} className="mt-4 text-[10px] uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors">Remove Photo</button>
            )}
          </div>

          <div className="lg:col-span-9 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-white/30 ml-2">Couple Name</p>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-white/30 ml-2">Event Date/Type</p>
                <input value={event} onChange={e => setEvent(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary/50 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-white/30 ml-2">Their Story</p>
              <textarea value={quote} onChange={e => setQuote(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 resize-none focus:border-primary/50 outline-none transition-all" />
            </div>
            <button onClick={addTestimonial} disabled={loading} className="group relative px-12 h-16 bg-primary text-black rounded-2xl font-bold uppercase text-[11px] tracking-[0.3em] overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(214,179,92,0.3)]">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Authorize & Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* TESTIMONIAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {items.map(t => (
          <AdminTestimonialCard key={t.id} t={t} refresh={fetchTestimonials} />
        ))}
      </div>
    </section>
  );
}

function AdminTestimonialCard({ t, refresh }: { t: Testimonial; refresh: () => void; }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleApproval = async () => {
    setIsUpdating(true);
    await supabase.from("testimonials").update({ is_approved: !t.is_approved }).eq("id", t.id);
    refresh();
    setIsUpdating(false);
  };

  const deleteWithStorage = async () => {
    if (!confirm("Delete permanently from database and storage?")) return;
    setIsUpdating(true);
    try {
      // 1. Extract file names from URLs
      // Assuming URL format: .../storage/v1/object/public/testimonials/filename.jpg
      const hiResName = t.image_url.split('/').pop();
      const previewName = t.image_preview_url?.split('/').pop();

      const filesToRemove = [hiResName, previewName].filter(Boolean) as string[];

      // 2. Remove from Storage bucket
      if (filesToRemove.length > 0) {
        await supabase.storage.from('testimonials').remove(filesToRemove);
      }

      // 3. Remove from Database
      await supabase.from("testimonials").delete().eq("id", t.id);
      
      refresh();
    } catch (error) {
      console.error("Cleanup failed:", error);
      alert("Error during deletion.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={cn(
      "group relative p-8 rounded-[2rem] transition-all duration-500 border",
      t.is_approved 
        ? "bg-white/[0.04] border-white/10 shadow-[inset_0_0_40px_rgba(214,179,92,0.03)]" 
        : "bg-black/40 border-white/5 opacity-60 hover:opacity-100"
    )}>
      <div className="flex items-start justify-between mb-8">
        <div className="relative">
          <img src={t.image_url} className={cn(
            "w-20 h-20 rounded-2xl object-cover transition-all duration-500",
            t.is_approved ? "grayscale-0 shadow-lg" : "grayscale"
          )} />
          {t.is_approved && (
            <div className="absolute -top-2 -right-2 bg-primary text-black rounded-full p-1 shadow-xl">
              <Check size={12} strokeWidth={4} />
            </div>
          )}
        </div>
        
        <button onClick={toggleApproval} disabled={isUpdating} className={cn(
          "px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all",
          t.is_approved ? "bg-primary/10 text-primary border border-primary/20" : "bg-white/5 text-white/40 border border-white/10 hover:border-primary/50"
        )}>
          {isUpdating ? <Loader2 size={12} className="animate-spin" /> : t.is_approved ? "Live on Site" : "Approve Story"}
        </button>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-serif text-xl tracking-wide">{t.name}</h4>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 mt-1">{t.event}</p>
        </div>
        <p className="text-sm text-white/50 italic leading-relaxed line-clamp-3">"{t.quote}"</p>
      </div>

      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-white/20">
          {t.is_approved ? <Sparkles size={12} /> : <CircleDashed size={12} />}
          {t.is_approved ? "Public Record" : "Draft Status"}
        </div>
        <button onClick={deleteWithStorage} className="text-red-400/40 hover:text-red-400 transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}





// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { Upload, Quote, Trash2, Check, Loader2, X, ShieldCheck, Clock } from "lucide-react";
// import { cn } from "@/lib/utils";

// /* ----------------------------------------
//    Types
// ---------------------------------------- */

// type Testimonial = {
//   id: string;
//   name: string;
//   event: string;
//   quote: string;
//   image_url: string;
//   image_preview_url: string | null;
//   is_approved: boolean; // Added for visibility control
// };

// /* ----------------------------------------
//    Image helpers (avatars)
// ---------------------------------------- */

// async function compressAvatar(file: File, size = 160, quality = 0.7): Promise<Blob> {
//   const bitmap = await createImageBitmap(file);
//   const scale = size / Math.max(bitmap.width, bitmap.height);
//   const canvas = document.createElement("canvas");
//   canvas.width = bitmap.width * scale;
//   canvas.height = bitmap.height * scale;
//   const ctx = canvas.getContext("2d")!;
//   ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
//   return new Promise(resolve => canvas.toBlob(blob => resolve(blob!), "image/jpeg", quality));
// }

// async function uploadTestimonialImage(file: File) {
//   const base = `testimonials/${Date.now()}`;
//   const hiPath = `${base}.jpg`;
//   await supabase.storage.from("testimonials").upload(hiPath, file, { upsert: true });
//   const hiUrl = supabase.storage.from("testimonials").getPublicUrl(hiPath).data.publicUrl;

//   const previewBlob = await compressAvatar(file);
//   const previewPath = `${base}-preview.jpg`;
//   await supabase.storage.from("testimonials").upload(previewPath, previewBlob, { upsert: true, contentType: "image/jpeg" });
//   const previewUrl = supabase.storage.from("testimonials").getPublicUrl(previewPath).data.publicUrl;

//   return { hiUrl, previewUrl };
// }

// export default function TestimonialsAdmin() {
//   const [items, setItems] = useState<Testimonial[]>([]);
//   const [name, setName] = useState("");
//   const [event, setEvent] = useState("");
//   const [quote, setQuote] = useState("");
//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   const fetchTestimonials = async () => {
//     const { data } = await supabase
//       .from("testimonials")
//       .select("*")
//       .order("id", { ascending: false });
//     setItems(data || []);
//   };

//   useEffect(() => { fetchTestimonials(); }, []);

//   const addTestimonial = async () => {
//     if (!name || !event || !quote || !image) return alert("All fields are required");
//     setLoading(true);
//     try {
//       const uploaded = await uploadTestimonialImage(image);
//       await supabase.from("testimonials").insert({
//         name,
//         event,
//         quote,
//         image_url: uploaded.hiUrl,
//         image_preview_url: uploaded.previewUrl,
//         is_approved: true, // Default to true when admin adds manually
//       });
//       setName(""); setEvent(""); setQuote(""); setImage(null);
//       fetchTestimonials();
//     } catch (err: any) { alert("Upload failed: " + err.message); }
//     finally { setLoading(false); }
//   };

//   return (
//     <section className="mt-20 p-6 max-w-7xl mx-auto text-white">
//       {/* HEADER */}
//       <div className="mb-12">
//         <span className="text-xs tracking-[0.4em] uppercase text-primary font-bold">Kind Words</span>
//         <h2 className="text-4xl md:text-5xl font-serif mt-2 italic">Management <span className="not-italic text-white">Suite</span></h2>
//         <div className="h-px w-20 bg-primary mt-4 opacity-50" />
//       </div>

//       {/* UPLOAD PANEL */}
//       <div className="bg-white/[0.03] border border-white/10 p-8 rounded-2xl mb-16 backdrop-blur-md">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="lg:col-span-3 flex flex-col items-center space-y-4">
//             <input type="file" accept="image/*" id="testimonial-image" onChange={e => setImage(e.target.files?.[0] || null)} className="hidden" />
//             <label htmlFor="testimonial-image" className={cn(
//               "w-40 h-40 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-500",
//               image ? "border-primary bg-primary/5 scale-105" : "border-white/10 bg-white/5 text-white/40 hover:border-primary/50"
//             )}>
//               {image ? <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" /> : <Upload />}
//             </label>
//             {image && (
//               <button onClick={() => setImage(null)} className="bg-red-500/80 hover:bg-red-500 rounded-full p-2 transition-colors">
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           <div className="lg:col-span-9 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input placeholder="Client Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" />
//               <input placeholder="Event (e.g. Wedding '24)" value={event} onChange={e => setEvent(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" />
//             </div>
//             <textarea placeholder="Client feedback..." value={quote} onChange={e => setQuote(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 resize-none focus:border-primary outline-none transition-colors" />
//             <button onClick={addTestimonial} disabled={loading} className="px-10 h-14 bg-primary text-black rounded-xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(214,179,92,0.2)]">
//               {loading ? <Loader2 className="animate-spin" /> : <Check />}
//               Publish Story
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* LIST */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//         {items.map(t => (
//           <TestimonialCard key={t.id} t={t} refresh={fetchTestimonials} />
//         ))}
//       </div>
//     </section>
//   );
// }

// function TestimonialCard({ t, refresh }: { t: Testimonial; refresh: () => void; }) {
//   const [loaded, setLoaded] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);

//   const toggleApproval = async () => {
//     setIsUpdating(true);
//     try {
//       await supabase
//         .from("testimonials")
//         .update({ is_approved: !t.is_approved })
//         .eq("id", t.id);
//       refresh();
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const deleteItem = async () => {
//     if (!confirm("Delete this memory permanently?")) return;
//     const paths = [
//       t.image_url.split('/testimonials/')[1],
//       t.image_preview_url?.split('/testimonials/')[1],
//     ].filter(Boolean);
//     await supabase.storage.from('testimonials').remove(paths);
//     await supabase.from("testimonials").delete().eq("id", t.id);
//     refresh();
//   };

//   return (
//     <div className={cn(
//       "bg-white/[0.03] border rounded-2xl p-6 transition-all duration-700 group relative overflow-hidden",
//       t.is_approved ? "border-primary/40 shadow-[0_0_30px_rgba(214,179,92,0.05)]" : "border-white/10"
//     )}>
//       {/* Status Badge */}
//       <div className="absolute top-4 right-4 z-10">
//         {t.is_approved ? (
//           <div className="bg-primary/20 p-1.5 rounded-full border border-primary/50 text-primary">
//             <ShieldCheck size={14} />
//           </div>
//         ) : (
//           <div className="bg-amber-500/20 p-1.5 rounded-full border border-amber-500/50 text-amber-500 animate-pulse">
//             <Clock size={14} />
//           </div>
//         )}
//       </div>

//       <div className="flex gap-4 mb-4">
//         <div className={cn(
//             "relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-500",
//             t.is_approved ? "border-primary shadow-[0_0_15px_rgba(214,179,92,0.3)]" : "border-white/10"
//         )}>
//           {t.image_preview_url && <img src={t.image_preview_url} className="absolute inset-0 w-full h-full object-cover blur-sm scale-110" />}
//           <img 
//             src={t.image_url} 
//             onLoad={() => setLoaded(true)} 
//             className={cn("absolute inset-0 w-full h-full object-cover transition-opacity duration-700", loaded ? "opacity-100" : "opacity-0")} 
//           />
//         </div>
//         <div className="pt-2">
//           <h4 className="font-serif text-xl text-white/90">{t.name}</h4>
//           <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">{t.event}</p>
//         </div>
//       </div>

//       <div className="relative">
//         <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/5 -z-0" />
//         <p className="italic text-sm text-white/60 line-clamp-3 relative z-10 pl-2">"{t.quote}"</p>
//       </div>

//       <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
//         <div className="flex gap-2">
//             <button
//                 onClick={toggleApproval}
//                 disabled={isUpdating}
//                 className={cn(
//                     "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all",
//                     t.is_approved 
//                         ? "bg-primary text-black" 
//                         : "bg-white/5 text-primary border border-primary/30 hover:bg-primary/10"
//                 )}
//             >
//                 {isUpdating ? <Loader2 size={12} className="animate-spin" /> : t.is_approved ? <Check size={12} /> : "Approve"}
//             </button>
//         </div>
        
//         <button onClick={deleteItem} className="text-white/20 hover:text-red-400 transition-colors p-2">
//           <Trash2 size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }





// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { Upload, User, Quote, Trash2, Check, Loader2, X } from "lucide-react";
// import { cn } from "@/lib/utils";

// /* ----------------------------------------
//    Image helpers (avatars)
// ---------------------------------------- */

// async function compressAvatar(
//   file: File,
//   size = 160,
//   quality = 0.7
// ): Promise<Blob> {
//   const bitmap = await createImageBitmap(file);
//   const scale = size / Math.max(bitmap.width, bitmap.height);

//   const canvas = document.createElement("canvas");
//   canvas.width = bitmap.width * scale;
//   canvas.height = bitmap.height * scale;

//   const ctx = canvas.getContext("2d")!;
//   ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

//   return new Promise(resolve =>
//     canvas.toBlob(blob => resolve(blob!), "image/jpeg", quality)
//   );
// }

// async function uploadTestimonialImage(file: File) {
//   const base = `testimonials/${Date.now()}`;

//   // hi-res
//   const hiPath = `${base}.jpg`;
//   await supabase.storage.from("testimonials").upload(hiPath, file, {
//     upsert: true,
//   });

//   const hiUrl = supabase.storage
//     .from("testimonials")
//     .getPublicUrl(hiPath).data.publicUrl;

//   // preview
//   const previewBlob = await compressAvatar(file);
//   const previewPath = `${base}-preview.jpg`;

//   await supabase.storage.from("testimonials").upload(previewPath, previewBlob, {
//     upsert: true,
//     contentType: "image/jpeg",
//   });

//   const previewUrl = supabase.storage
//     .from("testimonials")
//     .getPublicUrl(previewPath).data.publicUrl;

//   return { hiUrl, previewUrl };
// }

// /* ----------------------------------------
//    Types
// ---------------------------------------- */

// type Testimonial = {
//   id: string;
//   name: string;
//   event: string;
//   quote: string;
//   image_url: string;
//   image_preview_url: string | null;
// };

// export default function TestimonialsAdmin() {
//   const [items, setItems] = useState<Testimonial[]>([]);
//   const [name, setName] = useState("");
//   const [event, setEvent] = useState("");
//   const [quote, setQuote] = useState("");
//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   /* ---------------- DATA ---------------- */

//   const fetchTestimonials = async () => {
//     const { data } = await supabase
//       .from("testimonials")
//       .select("*")
//       .order("id", { ascending: false });

//     setItems(data || []);
//   };

//   useEffect(() => {
//     fetchTestimonials();
//   }, []);

//   /* ---------------- CREATE ---------------- */

//   const addTestimonial = async () => {
//     if (!name || !event || !quote || !image) {
//       alert("All fields are required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const uploaded = await uploadTestimonialImage(image);

//       await supabase.from("testimonials").insert({
//         name,
//         event,
//         quote,
//         image_url: uploaded.hiUrl,
//         image_preview_url: uploaded.previewUrl,
//       });

//       setName("");
//       setEvent("");
//       setQuote("");
//       setImage(null);
//       fetchTestimonials();
//     } catch (err: any) {
//       alert("Upload failed: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- RENDER ---------------- */

//   return (
//     <section className="mt-20 p-6">

//       {/* HEADER */}
//       <div className="mb-12">
//         <span className="text-xs tracking-[0.4em] uppercase text-primary font-bold">
//           Kind Words
//         </span>
//         <h2 className="text-4xl md:text-5xl font-serif mt-2 italic">
//           Client <span className="not-italic text-white">Stories</span>
//         </h2>
//         <div className="h-px w-20 bg-primary mt-4 opacity-50" />
//       </div>

//       {/* UPLOAD PANEL */}
//       <div className="bg-white/5 border border-white/10 p-8 rounded-2xl mb-16">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

//           {/* IMAGE */}
//           <div className="lg:col-span-3 flex flex-col items-center space-y-4">
//             <input
//               type="file"
//               accept="image/*"
//               id="testimonial-image"
//               onChange={e => setImage(e.target.files?.[0] || null)}
//               className="hidden"
//             />

//             <label
//               htmlFor="testimonial-image"
//               className={cn(
//                 "w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition",
//                 image
//                   ? "border-primary bg-primary/5"
//                   : "border-white/10 bg-white/5 text-white/40 hover:border-primary/50"
//               )}
//             >
//               {image ? (
//                 <img
//                   src={URL.createObjectURL(image)}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <Upload />
//               )}
//             </label>

//             {image && (
//               <button
//                 onClick={() => setImage(null)}
//                 className="absolute mt-[-110px] ml-[90px] bg-red-500 rounded-full p-1"
//               >
//                 <X size={12} />
//               </button>
//             )}
//           </div>

//           {/* FORM */}
//           <div className="lg:col-span-9 space-y-6">
//             <input
//               placeholder="Client Name"
//               value={name}
//               onChange={e => setName(e.target.value)}
//               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
//             />
//             <input
//               placeholder="Event"
//               value={event}
//               onChange={e => setEvent(e.target.value)}
//               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
//             />
//             <textarea
//               placeholder="Client feedback..."
//               value={quote}
//               onChange={e => setQuote(e.target.value)}
//               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 resize-none"
//             />

//             <button
//               onClick={addTestimonial}
//               disabled={loading}
//               className="px-12 h-12 bg-primary text-black rounded-xl font-bold flex items-center gap-3"
//             >
//               {loading ? <Loader2 className="animate-spin" /> : <Check />}
//               Publish Testimonial
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* LIST */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//         {items.map(t => (
//           <TestimonialCard key={t.id} t={t} refresh={fetchTestimonials} />
//         ))}
//       </div>
//     </section>
//   );
// }

// /* ----------------------------------------
//    Card (progressive avatar)
// ---------------------------------------- */

// function TestimonialCard({
//   t,
//   refresh,
// }: {
//   t: Testimonial;
//   refresh: () => void;
// }) {
//   const [loaded, setLoaded] = useState(false);

//   return (
//     <div className="bg-white/5 border border-white/10 rounded-2xl p-6 group">
//       <div className="flex gap-4 mb-4">
//         <div className="relative w-16 h-16 rounded-full overflow-hidden border border-primary/20">

//           {t.image_preview_url && (
//             <img
//               src={t.image_preview_url}
//               className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
//             />
//           )}

//           <img
//             src={t.image_url}
//             onLoad={() => setLoaded(true)}
//             className={cn(
//               "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
//               loaded ? "opacity-100" : "opacity-0"
//             )}
//           />
//         </div>

//         <div>
//           <h4 className="font-serif text-lg">{t.name}</h4>
//           <p className="text-xs uppercase tracking-widest text-primary">
//             {t.event}
//           </p>
//         </div>
//       </div>

//       <p className="italic text-sm text-white/60 line-clamp-4">
//         "{t.quote}"
//       </p>

//       <div className="mt-6 flex justify-between items-center">
//         <span className="text-[9px] uppercase text-white/20">Verified Client</span>
//         <button
//         onClick={async () => {
//             const paths = [
//               t.image_url.split('/testimonials/')[1],
//               t.image_preview_url?.split('/testimonials/')[1],
//             ].filter(Boolean);

//             await supabase.storage.from('testimonials').remove(paths);

//             await supabase.from("testimonials").delete().eq("id", t.id);

//             refresh();
//           }}
//           // onClick={() =>
//           //   supabase.from("testimonials").delete().eq("id", t.id).then(refresh)
//           // }
//           className="text-red-400/50 hover:text-red-400"
//         >
//           <Trash2 size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }


// // 