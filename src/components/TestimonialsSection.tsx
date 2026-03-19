import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Quote, ChevronLeft, ChevronRight, Upload, Send, ShieldCheck, Sparkles, Image as ImageIcon, ChevronDown, Star, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Testimonial = {
  id: string;
  name: string;
  event: string;
  quote: string;
  image_url: string;
  image_preview_url: string | null;
  email?: string;
  is_approved?: boolean;
};

const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      // delay: i * 0.1, 
      duration: 0.8, 
      ease: [0.215, 0.61, 0.355, 1] as any 
    }
  })
};


export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  /* ---------- FORM STATE ---------- */
  const [form, setForm] = useState({ name: "", email: "", event: "", quote: "" });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('id, name, quote, event, image_url, image_preview_url')
      .eq('is_approved', true)
      .order('id', { ascending: false })
      .then(({ data }) => { if (data?.length) setTestimonials(data); });
  }, []);

  const goToSlide = (newIndex: number, newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(newIndex);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !image || !form.event) return alert("Please fill in Name, Email, Event Type, and Photo");
    setLoading(true);
    try {
      const filePath = `testimonials/${Date.now()}.jpg`;
      await supabase.storage.from("testimonials").upload(filePath, image);
      const { data: { publicUrl } } = supabase.storage.from("testimonials").getPublicUrl(filePath);

      await supabase.from("testimonials").insert({
        ...form,
        image_url: publicUrl,
        image_preview_url: publicUrl,
        is_approved: false,
      });

      setForm({ name: "", email: "", event: "", quote: "" });
      setImage(null);
      alert("Thank you! Your story will be visible after review.");
    } catch (err) { alert("Submission failed."); } finally { setLoading(false); }
  };

  if (!testimonials.length) return null;
  const t = testimonials[currentIndex];

  return (
    <section className="relative py-24 bg-[#050505] text-white overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER AREA */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <div className="relative inline-block">
            <Star className="absolute -top-6 -right-10 text-primary/40 size-4 animate-pulse" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-primary/40" />
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.6em]">Shared Memories</span>
              <span className="h-px w-8 bg-primary/40" />
            </div>
            <h2 className="font-serif text-6xl md:text-7xl font-light tracking-tight">
              The <span className="italic font-normal">Love</span> Journal
            </h2>
          </div>
        </motion.div>

        {/* HERO SLIDER SECTION */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          variants={fadeInUp}
          className="max-w-7xl mx-auto"
        >
          <div className="relative">
            {/* Main Content Row */}
            <div className="flex flex-col lg:flex-row items-center lg:gap-24 mb-16">
            {/* <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-16"> */}
            
            
            {/* <div className="flex flex-col lg:flex-row items-stretch max-h-[450px] gap-12 lg:gap-24 mb-12"> */}
              
              {/* IMAGE COLUMN WITH ZOOM */}
              <div className="lg:w-1/2 flex justify-center lg:justify-end">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative w-72 h-72 md:w-[480px] md:h-[480px] group"
                  >
                      <div 
                        className="absolute inset-0 z-20 cursor-default" 
                        onContextMenu={(e) => e.preventDefault()}
                      />
                      <AnimatePresence mode="wait">
                        <motion.img
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.6 }}
                            src={t.image_url}
                            alt=""
                            draggable={false}
                            className="w-full h-full object-cover rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.6)] border border-white/10 pointer-events-none"
                        />
                      </AnimatePresence>
                      {/* <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-primary/20 rounded-bl-[2rem] z-10" /> */}
                  </motion.div>
              </div>

              {/* TEXT COLUMN */}
              <div className="lg:w-1/2 flex flex-col relative lg:py-8 ">
              {/* <div className="lg:w-1/2 flex flex-col relative lg:py-8 bg-[#A7D62D]"> */}
                {/* <div className="flex-grow flex flex-col justify-center min-h-[300px]"> */}
                <div className="flex flex-col justify-center min-h-[360px] lg:min-h-[480px]">
                {/* <div className="flex-grow flex flex-col justify-center min-h-[300px]"> */}
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Quote className="w-12 h-12 text-primary/10 mb-8 hidden lg:block" />
                      <h3 className="font-serif text-2xl md:text-4xl lg:text-5xl italic leading-tight text-white/90 mt-20 lg:mt-0 mb-12">
                        {t.quote}
                      </h3>
                      
                      <div className="flex items-center gap-4">
                        <div className="h-px w-10 bg-primary/30" />
                        <div>
                          <h4 className="text-xl font-medium tracking-[0.2em] text-primary uppercase">{t.name}</h4>
                          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mt-2">{t.event}</p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* INDEPENDENT CENTERED NAVIGATION (Back to where you liked it) */}
            <div className="flex items-center justify-center w-full lg:mt-20 relative z-10 ">
            {/* <div className="flex items-center justify-center gap-8 w-full mt-20 "> */}
                <button 
                  onClick={() => goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length, -1)} 
                  className="group p-5 rounded-full border border-white/5 hover:border-primary/40 transition-all bg-white/[0.03] hover:bg-white/[0.08]"
                >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                
                <div className="flex flex-col items-center justify-center w-[120px]">
                {/* <div className="flex flex-col items-center"> */}
                  <div className="text-[12px] tracking-[0.6em] text-white/30 font-bold ml-2">
                      {String(currentIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                  </div>
                  <div className="h-px w-12 bg-primary/20 mt-2" />
                </div>

                <button 
                  onClick={() => goToSlide((currentIndex + 1) % testimonials.length, 1)} 
                  className="group p-5 rounded-full border border-white/5 hover:border-primary/40 transition-all bg-white/[0.03] hover:bg-white/[0.08]"
                >
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>
        </motion.div>

       {/* BOTTOM FORM */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} custom={0} className="text-center mb-16">
            <Sparkles className="text-primary/40 size-5 mx-auto mb-6 animate-pulse" />
            <h3 className="text-3xl font-serif italic text-white/90">Share Your Story</h3>
            <p className="text-white/30 text-xs mt-3 uppercase tracking-[0.3em]">Be part of our celebration of love</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeInUp} custom={1} className="bg-white/[0.06] border border-white/10 rounded-2xl focus-within:border-primary/40 focus-within:bg-white/[0.1] transition-all duration-300 shadow-xl">
              <input 
                placeholder="Full Name"
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-transparent px-6 py-5 outline-none text-white/90 placeholder:text-white/20 text-sm" 
              />
            </motion.div>

            <motion.div variants={fadeInUp} custom={2} className="bg-white/[0.06] border border-white/10 rounded-2xl focus-within:border-primary/40 focus-within:bg-white/[0.1] transition-all duration-300 shadow-xl">
              <input 
                placeholder="Email Address"
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-transparent px-6 py-5 outline-none text-white/90 placeholder:text-white/20 text-sm" 
              />
            </motion.div>

            <motion.div variants={fadeInUp} custom={3} className="relative bg-white/[0.06] border border-white/10 rounded-2xl focus-within:border-primary/40 focus-within:bg-white/[0.1] transition-all duration-300 shadow-xl">
              <select 
                value={form.event} 
                onChange={e => setForm({...form, event: e.target.value})}
                className="w-full bg-transparent px-6 py-5 outline-none text-white appearance-none text-sm cursor-pointer"
              >
                <option value="" disabled className="bg-[#0a0a0a]">Select Event Type</option>
                <option value="prewedding" className="bg-[#0a0a0a]">Pre-Wedding</option>
                <option value="wedding" className="bg-[#0a0a0a]">Wedding</option>
                <option value="engagement" className="bg-[#0a0a0a]">Engagement</option>
                <option value="anniversary" className="bg-[#0a0a0a]">Anniversary</option>
                <option value="newborn" className="bg-[#0a0a0a]">Newborn</option>
                <option value="other" className="bg-[#0a0a0a]">Other</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none size-4" />
            </motion.div>

            <motion.label variants={fadeInUp} custom={4} className={cn(
              "group relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 transition-all duration-500 cursor-pointer overflow-hidden min-h-[64px]",
              image 
                ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(214,179,92,0.1)]" 
                : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
            )}>
                <div className="flex items-center gap-3">
                    {image ? (
                      <CheckCircle2 size={18} className="text-primary animate-in zoom-in" />
                    ) : (
                      <ImageIcon size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                    )}
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      image ? "text-primary" : "text-white/30 group-hover:text-white/50"
                    )}>
                        {image ? image.name : "Attach Special Moment"}
                    </span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
            </motion.label>

            <motion.div variants={fadeInUp} custom={5} className="md:col-span-2 bg-white/[0.06] border border-white/10 rounded-2xl focus-within:border-primary/40 focus-within:bg-white/[0.1] transition-all duration-300 shadow-xl">
              <textarea 
                placeholder="Write your story..." 
                rows={4}
                value={form.quote} 
                onChange={e => setForm({...form, quote: e.target.value})}
                className="w-full bg-transparent px-6 py-5 outline-none text-white/90 placeholder:text-white/20 text-sm resize-none"
              />
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} custom={6} className="mt-14 flex flex-col items-center">
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="group relative overflow-hidden bg-primary px-16 py-5 rounded-2xl text-black font-bold uppercase text-[10px] tracking-[0.4em] hover:shadow-[0_0_50px_rgba(214,179,92,0.3)] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Sending Story..." : <span className="flex items-center gap-3"><Send size={14} /> Submit Journal</span>}
            </button>
            <div className="mt-8 flex items-center gap-2 opacity-20 hover:opacity-40 transition-opacity">
              <ShieldCheck size={14} />
              <span className="text-[9px] uppercase tracking-[0.2em] font-semibold">End-to-End Encrypted</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}







// import { useEffect, useState } from "react";
// import { motion, AnimatePresence, Variants } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { Quote, ChevronLeft, ChevronRight, Upload, Send, ShieldCheck, Sparkles, Image as ImageIcon, ChevronDown, Star, CheckCircle2 } from "lucide-react";
// import { supabase } from "@/lib/supabase";

// type Testimonial = {
//   id: string;
//   name: string;
//   event: string;
//   quote: string;
//   image_url: string;
//   image_preview_url: string | null;
//   email?: string;
//   is_approved?: boolean;
// };
// const fadeInUp: Variants = {
//   hidden: { 
//     opacity: 0, 
//     y: 30 
//   },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: { 
//       // delay: i * 0.1, 
//       duration: 0.8, 
//       ease: [0.215, 0.61, 0.355, 1] as any 
//     }
//   })
// };
// export function TestimonialsSection() {
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);

//   /* ---------- FORM STATE ---------- */
//   const [form, setForm] = useState({ name: "", email: "", event: "", quote: "" });
//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     supabase
//       .from("testimonials")
//       .select("id, name, quote, event, image_url, image_preview_url")
//       .eq("is_approved", true)
//       .order("id", { ascending: false })
//       .then(({ data }) => { if (data?.length) setTestimonials(data); });
//   }, []);

//   const goToSlide = (newIndex: number) => {
//     if (isAnimating) return;
//     setIsAnimating(true);
//     setCurrentIndex(newIndex);
//     setTimeout(() => setIsAnimating(false), 600);
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.email || !image || !form.event) return alert("Please fill in all fields.");
//     setLoading(true);
//     try {
//       const filePath = `testimonials/${Date.now()}.jpg`;
//       await supabase.storage.from("testimonials").upload(filePath, image);
//       const { data: { publicUrl } } = supabase.storage.from("testimonials").getPublicUrl(filePath);

//       await supabase.from("testimonials").insert({
//         ...form,
//         image_url: publicUrl,
//         image_preview_url: publicUrl,
//         is_approved: false,
//       });

//       setForm({ name: "", email: "", event: "", quote: "" });
//       setImage(null);
//       alert("Thank you! Your story will be visible after review.");
//     } catch (err) { alert("Submission failed."); } finally { setLoading(false); }
//   };

//   if (!testimonials.length) return null;
//   const t = testimonials[currentIndex];

//   return (
//     <section className="relative py-24 bg-[#050505] text-white overflow-hidden font-sans">
//       <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      
//       <div className="container mx-auto px-6 relative z-10">
        
//         {/* HEADER */}
//         <div className="text-center mb-16">
//           <Star className="text-primary/40 size-4 mx-auto mb-4 animate-pulse" />
//           <h2 className="font-serif text-5xl md:text-7xl font-light tracking-tight">The Love Journal</h2>
//         </div>

//         {/* HERO SLIDER - Wrapper with consistent animation */}
//         <motion.div 
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: false, amount: 0.1 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="max-w-7xl mx-auto"
//         >
//           <div className="flex flex-col lg:flex-row items-center min-h-[500px] gap-12 lg:gap-24 mb-12">
            
//             {/* IMAGE */}
//             <div className="lg:w-1/2 flex justify-center lg:justify-end">
//               <motion.div 
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 transition={{ duration: 0.4 }}
//                 className="relative w-72 h-72 md:w-[480px] md:h-[480px]"
//               >
//                 <div className="absolute inset-0 z-20" onContextMenu={(e) => e.preventDefault()} />
//                 <AnimatePresence mode="wait">
//                   <motion.img
//                     key={currentIndex}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     src={t.image_url}
//                     alt={t.name}
//                     draggable={false}
//                     className="w-full h-full object-cover rounded-[2rem] shadow-2xl border border-white/10"
//                   />
//                 </AnimatePresence>
                
//                 {/* TAPERED CORNER FRAME */}
//                 <div className="absolute -bottom-4 -left-4 w-32 h-32 border-b border-l border-primary/50 rounded-bl-[2rem] -z-10 [mask-image:linear-gradient(to_top_right,black,transparent)]" />
//               </motion.div>
//             </div>

//             {/* TEXT */}
//             <div className="lg:w-1/2 flex flex-col justify-center py-8">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={currentIndex}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="min-h-[250px]"
//                 >
//                   <Quote className="w-10 h-10 text-primary/10 mb-8" />
//                   <h3 className="font-serif text-3xl md:text-5xl italic leading-tight text-white/90 mb-10">
//                     “{t.quote}”
//                   </h3>
//                   <div>
//                     <h4 className="text-xl font-medium tracking-[0.2em] text-primary uppercase">{t.name}</h4>
//                     <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mt-2">{t.event}</p>
//                   </div>
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* INDEPENDENT NAVIGATION */}
//           <div className="flex items-center justify-center gap-8 w-full mt-10">
//               <button 
//                 onClick={() => goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length)} 
//                 className="p-5 rounded-full border border-white/5 bg-white/[0.03] hover:bg-primary hover:text-black transition-all"
//               >
//                   <ChevronLeft size={24} />
//               </button>
              
//               <div className="flex flex-col items-center">
//                 <div className="text-[12px] tracking-[0.6em] text-white/30 font-bold ml-2">
//                     {String(currentIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
//                 </div>
//                 <div className="h-px w-12 bg-primary/20 mt-2" />
//               </div>

//               <button 
//                 onClick={() => goToSlide((currentIndex + 1) % testimonials.length)} 
//                 className="p-5 rounded-full border border-white/5 bg-white/[0.03] hover:bg-primary hover:text-black transition-all"
//               >
//                   <ChevronRight size={24} />
//               </button>
//           </div>
//         </motion.div>

//         {/* BOTTOM FORM - Entire block animates once */}
//         <motion.div 
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: false, amount: 0.1 }}
//           transition={{ duration: 0.8 }}
//           className="mt-40 max-w-4xl mx-auto"
//         >
//           {/* ... [Your Form Code remains exactly as you had it] ... */}

//           <motion.div variants={fadeInUp} custom={0} className="text-center mb-16">
//             <Sparkles className="text-primary/40 size-5 mx-auto mb-6 animate-pulse" />
//             <h3 className="text-3xl font-serif italic text-white/90">Share Your Story</h3>
//             <p className="text-white/30 text-xs mt-3 uppercase tracking-[0.3em]">Be part of our celebration of love</p>
//           </motion.div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <motion.div variants={fadeInUp} custom={1} className="bg-white/[0.06] border border-white/10 rounded-2xl focus-within:border-primary/40 focus-within:bg-white/[0.1] transition-all duration-300 shadow-xl">
//               <input 
//                 placeholder="Full Name"
//                 value={form.name} 
//                 onChange={e => setForm({...form, name: e.target.value})}
//                 className="w-full bg-transparent px-6 py-5 outline-none text-white/90 placeholder:text-white/20 text-sm" 
//               />
//             </motion.div>

//             <motion.div variants={fadeInUp} custom={2} className="bg-white/[0.06] border border-white/10 rounded-2xl focus-within:border-primary/40 focus-within:bg-white/[0.1] transition-all duration-300 shadow-xl">
//               <input 
//                 placeholder="Email Address"
//                 value={form.email} 
//                 onChange={e => setForm({...form, email: e.target.value})}
//                 className="w-full bg-transparent px-6 py-5 outline-none text-white/90 placeholder:text-white/20 text-sm" 
//               />
//             </motion.div>

//             <motion.div variants={fadeInUp} custom={3} className="relative bg-white/[0.06] border border-white/10 rounded-2xl focus-within:border-primary/40 focus-within:bg-white/[0.1] transition-all duration-300 shadow-xl">
//               <select 
//                 value={form.event} 
//                 onChange={e => setForm({...form, event: e.target.value})}
//                 className="w-full bg-transparent px-6 py-5 outline-none text-white appearance-none text-sm cursor-pointer"
//               >
//                 <option value="" disabled className="bg-[#0a0a0a]">Select Event Type</option>
//                 <option value="prewedding" className="bg-[#0a0a0a]">Pre-Wedding</option>
//                 <option value="wedding" className="bg-[#0a0a0a]">Wedding</option>
//                 <option value="engagement" className="bg-[#0a0a0a]">Engagement</option>
//                 <option value="anniversary" className="bg-[#0a0a0a]">Anniversary</option>
//                 <option value="newborn" className="bg-[#0a0a0a]">Newborn</option>
//                 <option value="other" className="bg-[#0a0a0a]">Other</option>
//               </select>
//               <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none size-4" />
//             </motion.div>

//             <motion.label variants={fadeInUp} custom={4} className={cn(
//               "group relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 transition-all duration-500 cursor-pointer overflow-hidden min-h-[64px]",
//               image 
//                 ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(214,179,92,0.1)]" 
//                 : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
//             )}>
//                 <div className="flex items-center gap-3">
//                     {image ? (
//                       <CheckCircle2 size={18} className="text-primary animate-in zoom-in" />
//                     ) : (
//                       <ImageIcon size={18} className="text-white/20 group-hover:text-primary transition-colors" />
//                     )}
//                     <span className={cn(
//                       "text-sm font-medium transition-colors",
//                       image ? "text-primary" : "text-white/30 group-hover:text-white/50"
//                     )}>
//                         {image ? image.name : "Attach Special Moment"}
//                     </span>
//                 </div>
//                 <input type="file" className="hidden" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
//             </motion.label>

//             <motion.div variants={fadeInUp} custom={5} className="md:col-span-2 bg-white/[0.06] border border-white/10 rounded-2xl focus-within:border-primary/40 focus-within:bg-white/[0.1] transition-all duration-300 shadow-xl">
//               <textarea 
//                 placeholder="Write your story..." 
//                 rows={4}
//                 value={form.quote} 
//                 onChange={e => setForm({...form, quote: e.target.value})}
//                 className="w-full bg-transparent px-6 py-5 outline-none text-white/90 placeholder:text-white/20 text-sm resize-none"
//               />
//             </motion.div>
//           </div>

//           <motion.div variants={fadeInUp} custom={6} className="mt-14 flex flex-col items-center">
//             <button 
//               onClick={handleSubmit}
//               disabled={loading}
//               className="group relative overflow-hidden bg-primary px-16 py-5 rounded-2xl text-black font-bold uppercase text-[10px] tracking-[0.4em] hover:shadow-[0_0_50px_rgba(214,179,92,0.3)] transition-all active:scale-95 disabled:opacity-50"
//             >
//               {loading ? "Sending Story..." : <span className="flex items-center gap-3"><Send size={14} /> Submit Journal</span>}
//             </button>
//             <div className="mt-8 flex items-center gap-2 opacity-20 hover:opacity-40 transition-opacity">
//               <ShieldCheck size={14} />
//               <span className="text-[9px] uppercase tracking-[0.2em] font-semibold">End-to-End Encrypted</span>
//             </div>
//           </motion.div>
//         </motion.div>
//           {/* (I've kept your form structure identical to maintain the look you liked) */}
//       </div>
//     </section>
//   );
// }

