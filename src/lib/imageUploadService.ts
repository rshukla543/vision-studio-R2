import { supabase } from "@/lib/supabase";

/* ---------- CONFIG ---------- */

const LOW_RES_MAX_SIZE = 128 * 1024; // 128 KB
const HIGH_RES_MAX_SIZE = 4 * 1024 * 1024; // 4 MB

const LOW_RES_WIDTH = 480;
const HIGH_RES_WIDTH = 1920;

const LOW_RES_QUALITY = 0.6;
const HIGH_RES_QUALITY = 0.85;

/* ---------- HELPERS ---------- */

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function compressImage(
  file: File,
  maxWidth: number,
  quality: number
): Promise<Blob> {
  const img = await loadImage(file);

  const scale = Math.min(1, maxWidth / img.width);
  const width = img.width * scale;
  const height = img.height * scale;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob!),
      "image/webp",
      quality
    );
  });
}

async function uploadToSupabase(
  bucket: string,
  path: string,
  file: Blob
): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) throw error;

  return supabase.storage
    .from(bucket)
    .getPublicUrl(path).data.publicUrl;
}

/* ---------- MAIN EXPORT ---------- */

export async function uploadImageWithVariants(params: {
  file: File;
  bucket: string;
  basePath: string; // e.g. "hero/slide-123"
}) {
  const { file, bucket, basePath } = params;

  // Case 1: very small image → no compression
  if (file.size <= LOW_RES_MAX_SIZE) {
    const path = `${basePath}.webp`;
    const url = await uploadToSupabase(bucket, path, file);

    return {
      imageUrl: url,
      previewUrl: url,
    };
  }

  // Always create low-res preview
  const lowResBlob = await compressImage(
    file,
    LOW_RES_WIDTH,
    LOW_RES_QUALITY
  );

  const previewUrl = await uploadToSupabase(
    bucket,
    `${basePath}-preview.webp`,
    lowResBlob
  );

  // Case 2: medium image → keep original
  if (file.size <= HIGH_RES_MAX_SIZE) {
    const imageUrl = await uploadToSupabase(
      bucket,
      `${basePath}.webp`,
      file
    );

    return { imageUrl, previewUrl };
  }

  // Case 3: huge image → compress high-res
  const highResBlob = await compressImage(
    file,
    HIGH_RES_WIDTH,
    HIGH_RES_QUALITY
  );

  const imageUrl = await uploadToSupabase(
    bucket,
    `${basePath}.webp`,
    highResBlob
  );

  return { imageUrl, previewUrl };
}
