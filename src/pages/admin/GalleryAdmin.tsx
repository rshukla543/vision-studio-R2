import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Edit3, Star, X, Check, Loader2, Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

import { uploadImageWithVariants } from "@/lib/imageUploadService";
import { fixGalleryImagePreviews } from "@/lib/galleryImageGlitchFix";

export default function GalleryAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Wedding',
    aspect_ratio: 'normal',
    image: null as File | null
  });

  const [editForm, setEditForm] = useState({ title: '', category: '', aspect_ratio: '' });

  const fetchGallery = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => { fetchGallery(); }, []);

  /* ---------- UPLOAD (MODIFIED LOGIC ONLY) ---------- */

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.image) return alert("Please select an image");

    setUploading(true);
    try {
      const result = await uploadImageWithVariants({
        file: newItem.image,
        bucket: "gallery",
        basePath: `gallery-${Date.now()}`
      });

      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          title: newItem.title || 'Untitled',
          category: newItem.category,
          aspect_ratio: newItem.aspect_ratio,
          image_url: result.imageUrl,
          preview_image_url: result.previewUrl,
          is_featured: false
        });

      if (dbError) throw dbError;

      setNewItem({ title: '', category: 'Wedding', aspect_ratio: 'normal', image: null });
      fetchGallery();
      alert("Image uploaded successfully!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  /* ---------- ACTIONS (UNCHANGED) ---------- */

  const deleteItem = async (id: string, imageUrl: string) => {
    if (!confirm("Permanently delete this image?")) return;
    const path = imageUrl.split('/').pop();
    if (path) await supabase.storage.from('gallery').remove([`gallery/${path}`]);
    await supabase.from('gallery_images').delete().eq('id', id);
    fetchGallery();
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    await supabase.from('gallery_images').update({ is_featured: !currentStatus }).eq('id', id);
    fetchGallery();
  };

  const startEditing = (item: any) => {
    setEditingId(item.id);
    setEditForm({ title: item.title, category: item.category, aspect_ratio: item.aspect_ratio });
  };

  const saveEdit = async (id: string) => {
    await supabase.from('gallery_images').update(editForm).eq('id', id);
    setEditingId(null);
    fetchGallery();
  };

  /* ---------- RENDER (UI UNCHANGED) ---------- */

  return (
    <section className="mt-20 p-6 bg-charcoal-deep min-h-screen text-foreground">
      <div className="max-w-7xl mx-auto">

        {/* ---- UPLOAD PANEL (UNCHANGED JSX) ---- */}
                {/* MODIFIED SECTION TITLE */}
        <div className="mb-12">
          <span className="text-xs tracking-[0.4em] uppercase text-primary font-bold">Portfolio Control</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-2 text-foreground font-light italic">
            Gallery <span className="text-white not-italic">Manager</span>
          </h2>
          <div className="h-px w-20 bg-primary mt-4 opacity-50" />
        </div>

        {/* BEAUTIFIED UPLOAD PANEL */}
        <div className="mb-16 bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="text-lg font-serif">Add New Masterpiece</h3>
              <p className="text-[10px] uppercase tracking-tighter text-white/40">Upload high-resolution photography only</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Custom File Upload Box */}
            <div className="md:col-span-4 space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">1. Select Asset</label>
              <div className="relative group">
                <input 
                  type="file" 
                  id="gallery-file"
                  accept="image/*"
                  onChange={(e) => setNewItem({...newItem, image: e.target.files?.[0] || null})}
                  className="hidden"
                />
                <label 
                  htmlFor="gallery-file"
                  className={cn(
                    "flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300",
                    newItem.image 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-white/10 bg-white/5 text-white/40 hover:border-primary/50 hover:bg-white/[0.07]"
                  )}
                >
                  {newItem.image ? (
                    <div className="flex flex-col items-center p-4">
                      <ImageIcon className="mb-2" size={24} />
                      <span className="text-[11px] font-medium truncate max-w-full italic px-4">
                        {newItem.image.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="mb-2 group-hover:scale-110 transition-transform" size={24} />
                      <span className="text-[10px] uppercase tracking-widest">Click to Browse</span>
                    </div>
                  )}
                </label>
                {!newItem.image && <p className="text-[10px] text-white/20 mt-2 italic text-center">No file selected</p>}
              </div>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">2. Session Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. The Royal Wedding"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">3. Category</label>
                  <select 
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none focus:border-primary transition-all appearance-none"
                  >
                    <option value="Wedding" className="bg-charcoal text-white">Wedding</option>
                    <option value="Pre-Wedding" className="bg-charcoal text-white">Pre-Wedding</option>
                    <option value="Candid" className="bg-charcoal text-white">Candid</option>
                    <option value="Newborn" className="bg-charcoal text-white">Newborn</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">4. Layout</label>
                  <select 
                    value={newItem.aspect_ratio}
                    onChange={(e) => setNewItem({...newItem, aspect_ratio: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none focus:border-primary transition-all appearance-none"
                  >
                    <option value="normal" className="bg-charcoal text-white">Square</option>
                    <option value="tall" className="bg-charcoal text-white">Tall (Portrait)</option>
                    <option value="short" className="bg-charcoal text-white">Wide (Landscape)</option>
                  </select>
                </div>
              </div>

              {/* Action Button spans both columns in the md grid */}
              <div className="md:col-span-2 pt-2">
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full bg-primary text-black h-[50px] rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-primary/80 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-primary/10"
                >
                  {uploading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                  {uploading ? 'Processing Asset...' : 'Publish to Live Gallery'}
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* (everything above remains identical) */}

        {/* GALLERY LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.id} className={cn(
              "group relative bg-black/40 rounded-2xl overflow-hidden border transition-all duration-500",
              editingId === item.id ? "border-primary ring-1 ring-primary" : "border-white/5 hover:border-white/20 hover:translate-y-[-4px]"
            )}>
              
              {/* IMAGE PREVIEW (LOW-RES) */}
              <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                <img
                  src={item.preview_image_url || item.image_url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => toggleFeatured(item.id, item.is_featured)}
                    className={cn(
                      "p-2.5 rounded-full backdrop-blur-md transition-all",
                      item.is_featured ? "bg-primary text-black" : "bg-black/40 text-white hover:text-primary"
                    )}
                  >
                    <Star size={14} fill={item.is_featured ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id, item.image_url)}
                    className="p-2.5 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* DETAILS (UNCHANGED) */}
              {/* rest of JSX stays exactly the same */}
            
              {/* DETAILS / EDIT FORM */}
              <div className="p-5">
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <input 
                      className="w-full bg-black/50 border border-white/20 p-2 text-xs rounded-lg"
                      value={editForm.title}
                      onChange={e => setEditForm({...editForm, title: e.target.value})}
                    />
                    <div className="flex gap-2">
                        <select 
                          className="flex-1 bg-black/50 border border-white/20 p-2 text-[10px] rounded-lg"
                          value={editForm.category}
                          onChange={e => setEditForm({...editForm, category: e.target.value})}
                        >
                            <option value="Wedding">Wedding</option>
                            <option value="Pre-Wedding">Pre-Wedding</option>
                            <option value="Candid">Candid</option>
                            <option value="Newborn">Newborn</option>
                        </select>
                        <select 
                          className="flex-1 bg-black/50 border border-white/20 p-2 text-[10px] rounded-lg"
                          value={editForm.aspect_ratio}
                          onChange={e => setEditForm({...editForm, aspect_ratio: e.target.value})}
                        >
                            <option value="normal">Square</option>
                            <option value="tall">Tall</option>
                            <option value="short">Wide</option>
                        </select>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button onClick={() => saveEdit(item.id)} className="flex-1 bg-primary text-black py-2 rounded-lg text-[10px] font-bold flex justify-center items-center gap-1 uppercase tracking-widest">
                            <Check size={12} /> Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="flex-1 bg-white/10 py-2 rounded-lg text-[10px] flex justify-center items-center gap-1 uppercase tracking-widest text-white/60">
                            <X size={12} /> Cancel
                        </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[9px] uppercase text-primary font-bold tracking-[0.2em]">{item.category}</span>
                            <h4 className="text-sm font-serif truncate mt-1 text-white/90">{item.title}</h4>
                        </div>
                        <button onClick={() => startEditing(item)} className="p-2 text-white/20 hover:text-primary transition-colors">
                            <Edit3 size={14} />
                        </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                         <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-white/30 uppercase tracking-tighter">
                            {item.aspect_ratio} Format
                         </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ---------- GLITCH FIX BUTTON ---------- */}
      <button
        onClick={async () => {
          if (!confirm("Fix missing gallery previews?")) return;
          await fixGalleryImagePreviews();
          fetchGallery();
        }}
        className="fixed bottom-6 left-6 text-[10px] uppercase tracking-widest px-4 py-3 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
      >
        Glitch Fix
      </button>
    </section>
  );
}


