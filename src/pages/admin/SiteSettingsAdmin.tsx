import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Mail, 
  Phone, 
  Instagram, 
  Type, 
  Save, 
  Loader2,
  Facebook,
  Upload,
  Image as ImageIcon,
  X,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminToast } from "@/components/admin/AdminToast";

type SiteSettings = {
  id: string;
  brand_name: string | null;
  brand_tagline: string | null;
  footer_description: string | null;
  email: string | null;
  phone: string | null;
  contact_location: string | null;
  instagram: string | null;
  facebook_handle: string | null; // New field
  copyright_text: string | null;
  logo_url: string | null; // New field
};

export default function SiteSettingsAdmin() {
  const { showToast } = useAdminToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const updateField = (key: keyof SiteSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const handleLogoUpload = async (): Promise<string | null> => {
    if (!logoFile) return settings?.logo_url || null;

    const fileExt = logoFile.name.split('.').pop();
    const fileName = `logo-${Math.random()}.${fileExt}`;
    const filePath = `branding/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("testimonials") // Reusing your existing bucket or use a 'site-assets' one
      .upload(filePath, logoFile);

    if (uploadError) {
      console.error(uploadError);
      return null;
    }

    const { data } = supabase.storage.from("testimonials").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);

    try {
      const finalLogoUrl = await handleLogoUpload();
      
      const { error } = await supabase
        .from("site_settings")
        .update({
          ...settings,
          logo_url: finalLogoUrl
        })
        .eq("id", settings.id);
      
      if (error) throw error;
      showToast("Site settings updated successfully");
      fetchSettings();
      setLogoFile(null);
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <section className="mt-20 p-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="mb-12">
        <span className="text-xs tracking-[0.4em] uppercase text-primary font-bold">Core Branding</span>
        <h2 className="text-4xl md:text-5xl font-serif mt-2 text-foreground font-light italic">
          Identity <span className="text-white not-italic">& Settings</span>
        </h2>
        <div className="h-px w-20 bg-primary mt-4 opacity-50" />
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* LOGO UPLOAD SECTION */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <ImageIcon className="text-primary" size={20} />
            <h3 className="text-lg font-serif">Site Logo</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className={cn(
                "w-32 h-32 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all",
                logoFile || settings.logo_url ? "border-primary/50" : "border-white/10"
              )}>
                {(logoFile || settings.logo_url) ? (
                  <img 
                    src={logoFile ? URL.createObjectURL(logoFile) : settings.logo_url!} 
                    alt="Logo Preview" 
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <ImageIcon size={32} className="text-white/10" />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <p className="text-sm text-white/40 leading-relaxed">
                Upload your brand logo. This will appear in the navigation bar, footer, and browser tab. Transparent PNG or SVG recommended.
              </p>
              <div className="flex gap-3">
                <input 
                  type="file" 
                  id="logo-upload" 
                  className="hidden" 
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="logo-upload"
                  className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-white/10 cursor-pointer transition-all flex items-center gap-2"
                >
                  <Upload size={14} /> {settings.logo_url ? "Change Logo" : "Upload Logo"}
                </label>
                {logoFile && (
                  <button onClick={() => setLogoFile(null)} className="text-red-400 hover:text-red-300">
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BRAND IDENTITY */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <Type className="text-primary" size={20} />
            <h3 className="text-lg font-serif">Identity Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">Brand Name</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                value={settings.brand_name || ""}
                onChange={(e) => updateField("brand_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">Tagline</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                value={settings.brand_tagline || ""}
                onChange={(e) => updateField("brand_tagline", e.target.value)}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">Footer Narrative</label>
              <textarea
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all resize-none"
                value={settings.footer_description || ""}
                onChange={(e) => updateField("footer_description", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CONTACT & SOCIAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
              <Mail className="text-primary" size={20} />
              <h3 className="text-lg font-serif">Connectivity</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">Email</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                  value={settings.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">Phone</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                  value={settings.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
              <Globe className="text-primary" size={20} />
              <h3 className="text-lg font-serif">Social Presense</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold flex items-center gap-2">
                  <Instagram size={12} /> Instagram
                </label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                  placeholder="@handle"
                  value={settings.instagram || ""}
                  onChange={(e) => updateField("instagram", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold flex items-center gap-2">
                  <Facebook size={12} /> Facebook
                </label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                  placeholder="facebook.com/page"
                  value={settings.facebook_handle || ""}
                  onChange={(e) => updateField("facebook_handle", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <Button 
          onClick={save} 
          disabled={saving}
          className="w-full md:w-auto px-16 h-[60px] bg-primary text-black hover:bg-primary/80 font-bold uppercase tracking-[0.3em] text-[12px] rounded-full flex items-center gap-3 transition-all shadow-xl shadow-primary/10"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? "Deploying..." : "Update Global Brand"}
        </Button>
      </div>
    </section>
  );
}