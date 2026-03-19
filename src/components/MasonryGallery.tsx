import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { LightboxWrapper } from './Lightbox';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const categories = ['All', 'Wedding', 'Pre-Wedding', 'Candid', 'Newborn'];

/* ---------------------------------------------
   Preview → Full Image Swap
--------------------------------------------- */
function ImageWithPreview({
  previewSrc,
  fullSrc,
  alt,
  className,
  draggable = false,
}: {
  previewSrc?: string | null;
  fullSrc: string;
  alt?: string;
  className?: string;
  draggable?: boolean;
}) {
  const [src, setSrc] = useState(previewSrc || fullSrc);

  useEffect(() => {
    if (!fullSrc) return;
    const img = new Image();
    img.src = fullSrc;
    img.onload = () => setSrc(fullSrc);
  }, [fullSrc]);

  return (
    <img
      src={src}
      alt={alt}
      draggable={draggable}
      onContextMenu={(e) => e.preventDefault()}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

/* ---------------------------------------------
   Skeleton
--------------------------------------------- */
const GallerySkeleton = () => (
  <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className={cn(
          'animate-shimmer rounded-2xl w-full bg-white/5',
          i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[3/2]'
        )}
      />
    ))}
  </div>
);

/* ---------------------------------------------
   Main Component
--------------------------------------------- */
export function MasonryGallery({ showFeatured = true }: { showFeatured?: boolean }) {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');

  // Read category from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setActiveCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentSlides, setCurrentSlides] = useState<any[]>([]);

  /* -------- DRAG STATE -------- */
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragThreshold = 6;
  const didDrag = useRef(false);

  const preventDefault = (e: any) => e.preventDefault();

  /* -------- DATA -------- */
  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setGalleryItems(
          data.map(item => ({
            ...item,
            category: item.category === 'Baby' ? 'Newborn' : item.category,
          }))
        );
      }
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter(i => i.category === activeCategory);

  const featuredItems = galleryItems.filter(i => i.is_featured);

  const handleOpenLightbox = (index: number, featured: boolean) => {
    const source = featured ? featuredItems : filteredItems;
    setCurrentSlides(source.map(i => ({ src: i.image_url, alt: i.title })));
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  /* -------- DRAG HANDLERS -------- */
  const startDrag = (clientX: number) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    didDrag.current = false;
    startX.current = clientX;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging.current || !scrollRef.current) return;
    const delta = clientX - startX.current;
    if (Math.abs(delta) > dragThreshold) didDrag.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - delta * 1.6;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  /* ---------------------------------------------
      Intersection observer for smooth reveal
  --------------------------------------------- */
  const revealRefs = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-6');
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      revealRefs.current.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, [filteredItems]);

  return (
    <section
      onContextMenu={preventDefault}
      className="py-24 bg-charcoal-deep overflow-hidden min-h-screen"
    >
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-primary font-bold">
            Portfolio
          </span>
          <h2 className="font-serif text-5xl font-light mt-4">
            Visual <span className="italic text-primary">Gallery</span>
          </h2>
        </motion.div>

        {/* FEATURED */}
        {!loading && showFeatured && featuredItems.length > 0 && (
          <div className="mb-20">
            <h3 className="text-sm tracking-[0.2em] uppercase mb-6 text-muted-foreground">
              Featured Work
            </h3>

            <div
              ref={scrollRef}
              onMouseDown={e => startDrag(e.clientX)}
              onMouseMove={e => onDragMove(e.clientX)}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
              onTouchStart={e => startDrag(e.touches[0].clientX)}
              onTouchMove={e => onDragMove(e.touches[0].clientX)}
              onTouchEnd={stopDrag}
              className="flex gap-1 overflow-x-auto no-scrollbar scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            >
              {/* <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }` }} /> */}
              {featuredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  onClick={() => { if (didDrag.current) return; handleOpenLightbox(i, true); }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.12 }}
                  className="group relative w-72 md:w-80 flex-shrink-0 overflow-hidden rounded-2xl"
                >
                  <ImageWithPreview
                    previewSrc={item.preview_image_url}
                    fullSrc={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/80 via-transparent opacity-100 md:opacity-60 md:group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-primary">
                      {item.category}
                    </span>
                    <p className="font-serif text-base md:text-lg text-foreground">
                      {item.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* FILTERS - Clean Scrollbar Fix */}
        {!loading && (
          <div className="flex overflow-x-auto scrollbar-hide md:justify-center gap-3 mb-16 pb-2 no-scrollbar">
            <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }` }} />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'whitespace-nowrap px-6 py-2 text-xs uppercase tracking-[0.2em] rounded-full border transition-all duration-300',
                  activeCategory === cat ? 'bg-primary text-black border-primary' : 'border-border/50 text-muted-foreground hover:border-primary'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* MASONRY */}
        {loading ? (
          <GallerySkeleton />
        ) : (
          <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                ref={el => { if(el) revealRefs.current[i] = el; }}
                onClick={() => handleOpenLightbox(i, false)}
                className="group relative break-inside-avoid overflow-hidden rounded-2xl opacity-0 translate-y-6 transition-all duration-700 will-change-transform contain-layout"
              >
                <ImageWithPreview
                  previewSrc={item.preview_image_url}
                  fullSrc={item.image_url}
                  alt={item.title}
                  className="block w-full object-cover transition-transform duration-700 md:group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/90 via-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-4 md:p-6 flex flex-col justify-end text-center">
                  <span className="text-[8px] md:text-[10px] uppercase text-primary tracking-[0.3em] mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-xs md:text-sm text-foreground font-serif">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <LightboxWrapper
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={currentSlides}
        index={lightboxIndex}
      />
    </section>
  );
}

