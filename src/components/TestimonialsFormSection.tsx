import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export function TestimonialFormSection() {
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");
  const [quote, setQuote] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !event || !quote || !email || !image) {
      alert("All fields required");
      return;
    }

    setLoading(true);

    const filePath = `testimonials/${Date.now()}.jpg`;

    await supabase.storage.from("testimonials").upload(filePath, image);

    const image_url = supabase.storage
      .from("testimonials")
      .getPublicUrl(filePath).data.publicUrl;

    await supabase.from("testimonials").insert({
      name,
      event,
      quote,
      email,
      image_url,
      image_preview_url: image_url,
      is_approved: false,
    });

    setName("");
    setEvent("");
    setQuote("");
    setEmail("");
    setImage(null);

    alert("Submitted! Awaiting approval.");
    setLoading(false);
  };

  return (
  <section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
    
    {/* Ambient Glow */}
    <div className="absolute -top-40 left-[-10%] w-[800px] h-[800px] bg-primary/10 blur-[220px] pointer-events-none" />

    <div className="relative container mx-auto max-w-4xl px-6 z-10">

      {/* Section Header */}
      <div className="text-center mb-20 space-y-6">
        <span className="text-xs tracking-[0.6em] uppercase text-primary font-semibold">
          Client Voices
        </span>

        <h2 className="font-serif text-5xl md:text-6xl text-white leading-tight">
          Share Your
          <span className="block italic text-primary mt-2">
            Experience
          </span>
        </h2>

        <p className="text-white/50 max-w-xl mx-auto">
          Your story matters. Tell us about your special moments and how we captured them.
        </p>
      </div>

      {/* Form Card */}
      <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-10 md:p-14 backdrop-blur-xl shadow-[0_0_80px_rgba(214,179,92,0.12)]">

        <div className="grid md:grid-cols-2 gap-8">

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">
              Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">
              Email
            </label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition"
            />
          </div>

          {/* Event */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">
              Event
            </label>
            <input
              value={event}
              onChange={e => setEvent(e.target.value)}
              placeholder="Wedding / Pre-Wedding / Newborn"
              className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition"
            />
          </div>

          {/* Quote */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">
              Your Experience
            </label>
            <textarea
              rows={5}
              value={quote}
              onChange={e => setQuote(e.target.value)}
              placeholder="Tell us how it felt..."
              className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2 space-y-3">
            <label className="text-xs uppercase tracking-widest text-white/40">
              Upload Photo
            </label>

            <div className="relative border border-dashed border-white/20 rounded-xl p-6 text-center hover:border-primary/40 transition">
              <input
                type="file"
                onChange={e => setImage(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <p className="text-white/40 text-sm">
                Click to upload a memory
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-12">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              w-full py-4 rounded-xl
              bg-primary text-black
              font-semibold tracking-wide
              hover:bg-primary/90
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Submitting..." : "Submit Testimonial"}
          </button>

          <p className="text-center text-white/30 text-xs mt-6">
            All testimonials are reviewed before being published.
          </p>
        </div>

      </div>
    </div>
  </section>
);
}