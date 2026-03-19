# Bedside Brilliance - Photography Portfolio Website

## Project Overview

**Type**: Luxury Photography Portfolio Website  
**Niche**: Wedding, Newborn, and Maternity Photography  
**Core Purpose**: Showcase premium photography services with emotional storytelling, cinematic presentation, and seamless booking experience  
**Brand Identity**: High-end, luxury, minimal elegance with gold accents and dark premium backgrounds

### Major User Flows
1. **Discovery Flow**: Homepage → Portfolio Gallery → Individual Image Lightbox
2. **Service Exploration**: Homepage → Services Page → Package Selection
3. **Booking Flow**: Contact Wizard (3-step) → Payment Integration → Confirmation
4. **Brand Story**: Homepage → About Section → Testimonials

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Routing** | React Router DOM v6 |
| **Styling System** | Tailwind CSS 3.4 |
| **UI Components** | Radix UI + shadcn/ui |
| **Animation Library** | Framer Motion |
| **State Management** | React Query (TanStack) |
| **Backend** | Supabase |
| **Database** | PostgreSQL (via Supabase) |
| **Storage** | Supabase Storage |
| **Payment** | Razorpay |
| **Forms** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |
| **Lightbox** | yet-another-react-lightbox |
| **Carousel** | Embla Carousel |
| **Hosting** | Vercel |

---

## Page Structure

### 1. Home Page (`/pages/Index.tsx`)
**Route**: `/`  
**Sections** (in order):
1. HeroSlider - Full-screen cinematic slider with video
2. WeddingThemes - Three moon-phase themed cards
3. NewbornFeature - Circular image feature section
4. MasonryGallery - Filterable portfolio grid
5. SignatureStyle - Photographer stats & signature
6. ContactWizard - 3-step booking form
7. AboutSection - Legacy/portrait section
8. TestimonialsSection - Carousel + submission form
9. Footer - Brand identity & social links

### 2. Portfolio Page (`/pages/Portfolio.tsx`)
**Route**: `/portfolio`  
**Components**: MasonryGallery (reused from home)

### 3. Services Page (`/pages/Services.tsx`)
**Route**: `/services`  
**Content**: Detailed service offerings

### 4. About Page (`/pages/About.tsx`)
**Route**: `/about`  
**Content**: Photographer story

### 5. Contact Page (`/pages/Contact.tsx`)
**Route**: `/contact`  
**Content**: Contact form

### 6. Admin Pages
- `/admin/login` - AdminLogin
- `/admin` - AdminLayout (protected)

---

## Section Inventory (Homepage)

### 1. HeroSlider
- **File**: `components/HeroSlider.tsx`
- **Background**: Full-bleed images/video with gradient overlays
- **Animation**: Framer Motion slide transitions (1.2s ease), Ken Burns effect
- **Fonts**: Cormorant Garamond (serif) headings
- **Data Source**: `hero_slides` table + static video
- **Visual Theme**: Cinematic, dramatic, immersive

### 2. WeddingThemes
- **File**: `components/WeddingThemes.tsx`
- **Background**: `bg-gradient-to-b from-charcoal to-charcoal-deep`
- **Animation**: Intersection observer fade-up, staggered cards
- **Components**: 3 moon phase SVG cards with hover effects
- **Data Source**: `wedding_themes_content` table
- **Visual Theme**: Elegant, mystical, celestial

### 3. NewbornFeature
- **File**: `components/NewbornFeature.tsx`
- **Background**: Custom gradient `linear-gradient(135deg, #1a1512 0%, #0a0a0a 50%, #1a1612 100%)`
- **Animation**: Intersection observer scale-in + blur
- **Components**: Circular image frame with decorative rings
- **Data Source**: `newborn_feature` table
- **Visual Theme**: Warm, intimate, gentle

### 4. MasonryGallery
- **File**: `components/MasonryGallery.tsx`
- **Background**: `bg-charcoal-deep`
- **Animation**: Framer Motion stagger reveal, scroll-based fade-in
- **Components**: Category filters, masonry grid, lightbox
- **Data Source**: `gallery_images` table
- **Visual Theme**: Clean, editorial, professional

### 5. SignatureStyle
- **File**: `components/SignatureStyle.tsx`
- **Background**: `bg-[#050505]` with primary/5 blur glow
- **Animation**: Framer Motion stagger, word-by-word quote reveal
- **Components**: Editorial rectangular image frame, stats grid
- **Data Source**: `signature_style` table
- **Visual Theme**: Luxury editorial, sophisticated

### 6. ContactWizard
- **File**: `components/ContactWizard.tsx`
- **Background**: `bg-charcoal-deep`
- **Animation**: Step transition fade-in, progress indicator
- **Components**: 3-step form, calendar picker, package cards
- **Data Source**: `bookings` table (write)
- **Visual Theme**: Clean, minimal, premium form

### 7. AboutSection
- **File**: `components/AboutSection.tsx`
- **Background**: `bg-[#050505]` with ambient blur
- **Animation**: Framer Motion stagger, word-by-word quote
- **Components**: Portrait frame with EST badge, stats
- **Data Source**: `about_content` table
- **Visual Theme**: Editorial, legacy-focused

### 8. TestimonialsSection
- **File**: `components/TestimonialsSection.tsx`
- **Background**: `bg-[#050505]` with primary/5 blur
- **Animation**: Carousel slide transitions, form animations
- **Components**: Testimonial carousel, image upload form
- **Data Source**: `testimonials` table
- **Visual Theme**: Personal, warm, trustworthy

### 9. Footer
- **File**: `components/Footer.tsx`
- **Background**: `bg-charcoal-deep` with cinematic top border
- **Animation**: Fade-in on scroll
- **Components**: Brand logo, social links, contact tooltips
- **Data Source**: `site_settings` table
- **Visual Theme**: Elegant closure, brand reinforcement

---

## UI Pattern System

### Typography
- **Primary Font**: Cormorant Garamond (serif) - for headings
- **Secondary Font**: Montserrat (sans-serif) - for body/UI
- **Heading Styles**: 
  - H1: `text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-light`
  - H2: `font-serif text-4xl md:text-5xl lg:text-6xl font-light`
  - Eyebrow: `text-[10px] tracking-[0.3em] uppercase`

### Color System
| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `hsl(43 59% 52%)` | Gold accent, CTAs, highlights |
| `--background` | `hsl(0 0% 7%)` | Deep dark background |
| `--foreground` | `hsl(43 30% 92%)` | Primary text (ivory) |
| `--charcoal` | `hsl(0 0% 10%)` | Card backgrounds |
| `--charcoal-deep` | `hsl(0 0% 7%)` | Section backgrounds |
| `--muted` | `hsl(0 0% 18%)` | Subtle backgrounds |
| `--border` | `hsl(43 20% 20%)` | Borders, dividers |

### Animation System
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` (luxury smooth)
- **Fade Up**: `0.8s ease-out`, 40px translate
- **Stagger**: `0.1s - 0.15s` between children
- **Hover Transitions**: `0.3s - 0.7s` duration

### Reusable Components
- `SectionDivider` - Gold/subtle dividers
- `PageTransition` - Route transition wrapper
- `Button` variants: hero, minimal, gold, outline
- `LightboxWrapper` - Image lightbox
- `Container` - Max-width wrapper

---

## Supabase Structure

### Tables

#### 1. `hero_slides`
| Column | Type | Purpose |
|--------|------|---------|
| id | uuid | Primary key |
| title | text | Slide headline |
| subtitle | text | Slide subheadline |
| description | text | Small eyebrow text |
| image_url | text | Full image URL |
| preview_image_url | text | Low-res placeholder |
| order_index | int | Sort order |

#### 2. `wedding_themes_content`
| Column | Type | Purpose |
|--------|------|---------|
| singleton_key | text | "1" (single row) |
| eyebrow_text | text | Section label |
| heading_base | text | Main heading |
| heading_highlight | text | Italic highlight |
| theme1_title, 2, 3 | text | Card titles |
| theme1_description, 2, 3 | text | Card descriptions |
| theme1_phase, 2, 3 | text | Moon phase labels |

#### 3. `newborn_feature`
| Column | Type | Purpose |
|--------|------|---------|
| eyebrow_text | text | Section label |
| headline_base | text | Main heading |
| headline_highlight | text | Highlight word |
| description_1, 2 | text | Paragraphs |
| image_url | text | Feature image |
| preview_image_url | text | Placeholder |
| primary_btn_text, secondary_btn_text | text | CTA labels |
| primary_btn_link, secondary_btn_link | text | CTA URLs |

#### 4. `gallery_images`
| Column | Type | Purpose |
|--------|------|---------|
| id | uuid | Primary key |
| title | text | Image title |
| category | text | Wedding/Pre-Wedding/Candid/Newborn |
| image_url | text | Full image |
| preview_image_url | text | Thumbnail |
| is_featured | boolean | Featured carousel |
| created_at | timestamp | Sort order |

#### 5. `signature_style`
| Column | Type | Purpose |
|--------|------|---------|
| tagline | text | Eyebrow text |
| title_line_1 | text | Main heading |
| title_highlight | text | Highlight word |
| description_1, 2 | text | Paragraphs |
| stat_1_value, 2_value, 3_value | text | Stats numbers |
| stat_1_label, 2_label, 3_label | text | Stats labels |
| image_url | text | Portrait image |

#### 6. `about_content`
| Column | Type | Purpose |
|--------|------|---------|
| singleton_key | int | 1 |
| eyebrow_text | text | Section label |
| headline | text | Main heading |
| highlighted_word | text | Italic word |
| body_paragraph_1, 2 | text | Content |
| weddings_count, label | text | Stats |
| experience_years, label | text | Stats |
| quote_text | text | Bottom quote |
| portrait_image_url, preview_url | text | Images |

#### 7. `testimonials`
| Column | Type | Purpose |
|--------|------|---------|
| id | uuid | Primary key |
| name | text | Client name |
| event | text | Event type |
| quote | text | Testimonial text |
| image_url | text | Photo |
| image_preview_url | text | Thumbnail |
| email | text | Contact |
| is_approved | boolean | Moderation |

#### 8. `site_settings`
| Column | Type | Purpose |
|--------|------|---------|
| brand_name | text | Studio name |
| brand_tagline | text | Tagline |
| logo_url | text | Logo image |
| email, phone | text | Contact info |
| instagram, facebook_handle | text | Social |
| contact_location | text | Address |

#### 9. `bookings`
| Column | Type | Purpose |
|--------|------|---------|
| id | uuid | Primary key |
| name, email, phone | text | Contact |
| event_type | text | Category |
| booking_date | date | Event date |
| venue | text | Location |
| guest_count | text | Attendees |
| package_id | text | Selected package |
| message | text | Notes |
| status | text | pending/confirmed/cancelled |
| created_at | timestamp | Booking time |

### Storage Buckets
- `testimonials` - Client uploaded photos
- `gallery` - Portfolio images
- `portfolio` - Additional portfolio assets

---

## Frontend → Backend Data Flow

```
Home Page
├── HeroSlider
│   └── Supabase: hero_slides (read)
├── WeddingThemes
│   └── Supabase: wedding_themes_content (read)
├── NewbornFeature
│   └── Supabase: newborn_feature (read)
├── MasonryGallery
│   └── Supabase: gallery_images (read)
├── SignatureStyle
│   └── Supabase: signature_style (read)
├── ContactWizard
│   └── Supabase: bookings (write)
├── AboutSection
│   └── Supabase: about_content (read)
├── TestimonialsSection
│   ├── Supabase: testimonials (read approved)
│   └── Supabase: testimonials (write new), storage: testimonials (upload)
└── Footer
    └── Supabase: site_settings (read)
```

---

## Design Inconsistencies Identified

### Background Compatibility Issues
1. **HeroSlider to WeddingThemes**: Hero uses dynamic images/video → WeddingThemes uses `bg-gradient-to-b from-charcoal to-charcoal-deep`. Hard transition at boundary.

2. **WeddingThemes to NewbornFeature**: WeddingThemes ends with `charcoal-deep` → NewbornFeature uses custom `linear-gradient(135deg, #1a1512...)`. Slight color mismatch.

3. **NewbornFeature to MasonryGallery**: Newborn uses warm gradient → Masonry uses `bg-charcoal-deep`. Abrupt cool shift.

4. **MasonryGallery to SignatureStyle**: Both use dark backgrounds but Masonry has `bg-charcoal-deep` while Signature uses `bg-[#050505]`. Nearly identical but not unified.

5. **SignatureStyle to ContactWizard**: `bg-[#050505]` → `bg-charcoal-deep`. Slight shade difference.

6. **ContactWizard to AboutSection**: `bg-charcoal-deep` → `bg-[#050505]`. Inconsistent.

### Animation Inconsistencies
1. **Timing Variations**: 
   - WeddingThemes: 1000ms duration
   - NewbornFeature: 1000ms with 300ms delay
   - MasonryGallery: 700ms-1000ms
   - SignatureStyle: Uses Framer Motion with 0.9s-1s
   
2. **Easing Functions**:
   - Most use custom `cubic-bezier(0.22, 1, 0.36, 1)`
   - Some use default ease-out
   - ContactWizard uses `animate-in fade-in` (Tailwind)

3. **Trigger Methods**:
   - Some use IntersectionObserver manually
   - Some use Framer Motion `whileInView`
   - Some use `useInView` hook

### Spacing Inconsistencies
1. **Section Padding**:
   - HeroSlider: No padding (full bleed)
   - WeddingThemes: `py-32`
   - NewbornFeature: `py-20 md:py-32`
   - MasonryGallery: `py-24`
   - SignatureStyle: `py-24 md:py-40`
   - ContactWizard: `py-32`
   - AboutSection: `py-24 md:py-40`
   - TestimonialsSection: `py-24`

2. **Container Gaps**: Inconsistent gap sizing between sections

### Typography Inconsistencies
1. **Eyebrow Text Sizes**:
   - Some use `text-xs`
   - Some use `text-[10px]`
   
2. **Heading Hierarchy**: Not strictly followed across all sections

---

## Critical Implementation Notes

### DO NOT MODIFY:
- Individual section internal layouts
- Typography within sections
- Animation logic inside components
- Component color schemes
- Data fetching patterns

### ALLOWED MODIFICATIONS ONLY:
- Section wrapper containers
- Inter-section gradient transitions
- Divider components between sections
- Section padding/margins at boundaries
- Global transition overlays

---

## File Structure

```
src/
├── pages/
│   ├── Index.tsx          # Homepage with all sections
│   ├── Portfolio.tsx
│   ├── Services.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── NotFound.tsx
│   └── admin/             # Admin panel pages
├── components/
│   ├── HeroSlider.tsx
│   ├── WeddingThemes.tsx
│   ├── NewbornFeature.tsx
│   ├── MasonryGallery.tsx
│   ├── SignatureStyle.tsx
│   ├── ContactWizard.tsx
│   ├── AboutSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── SectionDivider.tsx
│   ├── PageTransition.tsx
│   ├── Lightbox.tsx
│   └── ui/                # shadcn components
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── utils.ts           # cn() helper
│   ├── auth.ts            # Auth utilities
│   ├── razorpay.ts        # Payment integration
│   ├── imageProcessing.ts # Image utilities
│   └── imageUploadService.ts
├── hooks/
│   └── use-toast.ts
├── assets/                # Static assets
└── index.css              # Global styles + CSS variables
```

---

## Environment Variables

```
VITE_SUPABASE_URL=https://vpdctxxqjfvqahemrgyn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Last Updated
Generated: March 2026  
Project Version: Production  
Maintainer: AI Development Assistant
