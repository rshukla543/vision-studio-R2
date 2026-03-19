import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Type, Sparkles, Package, DollarSign, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminToast } from "@/components/admin/AdminToast";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ServiceAdmin() {
  const { showToast } = useAdminToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services_packages")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) console.error(error);
    setServices(data || []);
    setLoading(false);
  };

  const updateServiceField = (index: number, field: string, value: any) => {
    const next = [...services];
    next[index][field] = value;
    setServices(next);
  };

  const saveAll = async () => {
    setSaving(true);
    await Promise.all(
      services.map(service =>
        supabase.from("services_packages").upsert(service)
      )
    );
    setSaving(false);
    showToast("Services updated successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mt-20 p-6 max-w-7xl mx-auto"
    >
      {/* HEADER */}
      <motion.div variants={cardVariants} className="mb-14">
        <span className="text-xs tracking-[0.4em] uppercase text-primary font-bold">
          Pricing CMS
        </span>
        <h2 className="text-4xl md:text-5xl font-serif mt-2 text-foreground font-light italic">
          Services <span className="text-white not-italic">& Packages</span>
        </h2>
        <div className="h-px w-20 bg-primary mt-4 opacity-50" />
      </motion.div>

      {/* GRID */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {services.map((service, index) => (
          <motion.div
            key={service.id || index}
            variants={cardVariants}
            className={`rounded-2xl border p-8 space-y-6 transition-all
              ${
                service.featured
                  ? "border-primary/40 bg-primary/5"
                  : "border-white/10 bg-white/5"
              }
            `}
          >
            {/* CARD HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-primary">
                <Package size={18} />
                <span className="text-xs uppercase tracking-widest">
                  Package
                </span>
              </div>

              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50">
                Featured
                <input
                  type="checkbox"
                  checked={service.featured}
                  onChange={e =>
                    updateServiceField(index, "featured", e.target.checked)
                  }
                  className="accent-primary"
                />
              </label>
            </div>

            {/* FIELDS */}
            <div className="space-y-4">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                placeholder="Service Title"
                value={service.title}
                onChange={e =>
                  updateServiceField(index, "title", e.target.value)
                }
              />

              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/70 outline-none"
                placeholder="Subtitle"
                value={service.subtitle}
                onChange={e =>
                  updateServiceField(index, "subtitle", e.target.value)
                }
              />

              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-primary font-serif outline-none"
                placeholder="Price (e.g. From ₹...)"
                value={service.price}
                onChange={e =>
                  updateServiceField(index, "price", e.target.value)
                }
              />
            </div>

            {/* FEATURES */}
            {/* <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">
                Included Features
              </label>
              <textarea
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs scrollbar-hidden focus:border-primary outline-none resize-none "
                value={service.features?.join("\n") || ""}
                onChange={e =>
                  updateServiceField(
                    index,
                    "features",
                    e.target.value.split("\n")
                  )
                }
              />
            </div> */}

            {/* FEATURES */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">
                Included Features
              </label>

              <textarea
                rows={5}
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-xl

                  px-5
                  py-5

                  text-xs
                  leading-relaxed

                  scrollbar-hidden
                  focus:border-primary
                  outline-none
                  resize-none

                  scroll-py-4
                  scroll-px-4
                "
                value={service.features?.join("\n") || ""}
                onChange={e =>
                  updateServiceField(
                    index,
                    "features",
                    e.target.value.split("\n")
                  )
                }
              />
            </div>


            {/* ORDER */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-[10px] uppercase tracking-widest text-white/40">
                Display Order
              </span>
              <input
                type="number"
                className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1  text-xs outline-none"
                value={service.display_order}
                onChange={e =>
                  updateServiceField(
                    index,
                    "display_order",
                    Number(e.target.value)
                  )
                }
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* SAVE */}
      <div className="mt-16 flex justify-center">
        <Button
          onClick={saveAll}
          disabled={saving}
          className="w-full md:w-auto px-16 h-[60px] bg-primary text-black hover:bg-primary/80 font-bold uppercase tracking-[0.3em] text-[12px] rounded-full flex items-center gap-3 transition-all shadow-xl shadow-primary/10"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? "Deploying..." : "Update Services"}
        </Button>
      </div>
    </motion.section>
  );
}
