export type ProcessedImage = {
  uploadBlob: Blob;
  previewBlob: Blob;
  previewUrl: string;
};

export async function processImage(
  file: File,
  opts: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    maxFileSizeMB: number;
  }
): Promise<ProcessedImage> {
  if (file.size / 1024 / 1024 > opts.maxFileSizeMB) {
    throw new Error(`Max file size ${opts.maxFileSizeMB}MB exceeded`);
  }

  const bitmap = await createImageBitmap(file);

  const scale = Math.min(
    opts.maxWidth / bitmap.width,
    opts.maxHeight / bitmap.height,
    1
  );

  // ---- HI RES ----
  const hiCanvas = document.createElement("canvas");
  hiCanvas.width = bitmap.width * scale;
  hiCanvas.height = bitmap.height * scale;

  const hiCtx = hiCanvas.getContext("2d")!;
  hiCtx.drawImage(bitmap, 0, 0, hiCanvas.width, hiCanvas.height);

  const uploadBlob = await new Promise<Blob>(resolve =>
    hiCanvas.toBlob(
      b => resolve(b!),
      "image/jpeg",
      opts.quality
    )
  );

  // ---- PREVIEW ----
  const previewScale = Math.min(400 / bitmap.width, 1);
  const previewCanvas = document.createElement("canvas");
  previewCanvas.width = bitmap.width * previewScale;
  previewCanvas.height = bitmap.height * previewScale;

  const pCtx = previewCanvas.getContext("2d")!;
  pCtx.drawImage(bitmap, 0, 0, previewCanvas.width, previewCanvas.height);

  const previewBlob = await new Promise<Blob>(resolve =>
    previewCanvas.toBlob(b => resolve(b!), "image/jpeg", 0.5)
  );

  const previewUrl = URL.createObjectURL(previewBlob);

  return { uploadBlob, previewBlob, previewUrl };
}

export async function uploadProcessedImage(
  supabase: any,
  bucket: string,
  path: string,
  blob: Blob
): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, {
      upsert: true,
      contentType: "image/jpeg",
    });

  if (error) throw error;

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}




// // lib/imageProcessing.ts

// type ProcessOptions = {
//   maxWidth: number;
//   maxHeight: number;
//   quality: number;
//   maxFileSizeMB: number;
// };

// export async function processImage(
//   file: File,
//   options: ProcessOptions
// ) {
//   const img = new Image();
//   const objectUrl = URL.createObjectURL(file);

//   await new Promise<void>((resolve, reject) => {
//     img.onload = () => resolve();
//     img.onerror = reject;
//     img.src = objectUrl;
//   });

//   /* ---------- HI-RES ---------- */

//   const hiCanvas = document.createElement("canvas");
//   const hiCtx = hiCanvas.getContext("2d")!;

//   const scale = Math.min(
//     options.maxWidth / img.width,
//     options.maxHeight / img.height,
//     1
//   );

//   hiCanvas.width = img.width * scale;
//   hiCanvas.height = img.height * scale;

//   hiCtx.drawImage(img, 0, 0, hiCanvas.width, hiCanvas.height);

//   const uploadBlob: Blob = await new Promise(resolve =>
//     hiCanvas.toBlob(
//       b => resolve(b!),
//       "image/jpeg",
//       options.quality
//     )
//   );

//   /* ---------- PREVIEW ---------- */

//   const previewCanvas = document.createElement("canvas");
//   const previewCtx = previewCanvas.getContext("2d")!;

//   const PREVIEW_WIDTH = 400;
//   const previewScale = PREVIEW_WIDTH / img.width;

//   previewCanvas.width = PREVIEW_WIDTH;
//   previewCanvas.height = img.height * previewScale;

//   previewCtx.drawImage(
//     img,
//     0,
//     0,
//     previewCanvas.width,
//     previewCanvas.height
//   );

//   const previewBlob: Blob = await new Promise(resolve =>
//     previewCanvas.toBlob(
//       b => resolve(b!),
//       "image/jpeg",
//       0.5
//     )
//   );

//   const previewUrl = URL.createObjectURL(previewBlob);

//   URL.revokeObjectURL(objectUrl);

//   return {
//     uploadBlob,     // hi-res blob
//     previewBlob,    // small blob (FIX)
//     previewUrl,     // instant UI preview
//   };
// }

// /* ---------- UPLOAD ---------- */

// export async function uploadProcessedImage(
//   blob: Blob,
//   supabase: any,
//   bucket: string,
//   path: string
// ) {
//   const { error } = await supabase.storage
//     .from(bucket)
//     .upload(path, blob, {
//       contentType: "image/jpeg",
//       upsert: true,
//     });

//   if (error) throw error;

//   const { data } = supabase.storage
//     .from(bucket)
//     .getPublicUrl(path);

//   return data.publicUrl;
// }




// // src/lib/imageProcessing.ts

// export type ProcessedImage = {
//   previewUrl: string;        // local preview (URL.createObjectURL)
//   uploadBlob: Blob;          // optimized image for upload
//   width: number;
//   height: number;
//   sizeKB: number;
// };

// export type ImageProcessOptions = {
//   maxWidth?: number;
//   maxHeight?: number;
//   quality?: number;
//   maxFileSizeMB?: number;
// };

// /* ----------------------------------------
//    DEFAULT LIMITS (SAFE FOR SCROLLING)
// ----------------------------------------- */

// const DEFAULTS = {
//   maxWidth: 2400,
//   maxHeight: 2400,
//   quality: 0.75,
//   maxFileSizeMB: 25,
// };

// /* ----------------------------------------
//    MAIN ENTRY
// ----------------------------------------- */

// export async function processImage(
//   file: File,
//   options: ImageProcessOptions = {}
// ): Promise<ProcessedImage> {
//   const {
//     maxWidth,
//     maxHeight,
//     quality,
//     maxFileSizeMB,
//   } = { ...DEFAULTS, ...options };

//   // 1️⃣ Validate original file size
//   const fileSizeMB = file.size / (1024 * 1024);
//   if (fileSizeMB > maxFileSizeMB) {
//     throw new Error(
//       `Image too large (${fileSizeMB.toFixed(1)}MB). Max allowed is ${maxFileSizeMB}MB.`
//     );
//   }

//   // 2️⃣ Decode safely off the DOM
//   const bitmap = await createImageBitmap(file);

//   // 3️⃣ Calculate scaled dimensions
//   const scale = Math.min(
//     1,
//     maxWidth / bitmap.width,
//     maxHeight / bitmap.height
//   );

//   const targetWidth = Math.round(bitmap.width * scale);
//   const targetHeight = Math.round(bitmap.height * scale);

//   // 4️⃣ Draw to canvas
//   const canvas = document.createElement("canvas");
//   canvas.width = targetWidth;
//   canvas.height = targetHeight;

//   const ctx = canvas.getContext("2d");
//   if (!ctx) throw new Error("Canvas not supported");

//   ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

//   // 5️⃣ Export compressed JPEG
//   const uploadBlob: Blob = await new Promise((resolve) => {
//     canvas.toBlob(
//       (blob) => resolve(blob as Blob),
//       "image/jpeg",
//       quality
//     );
//   });


// // ##################################################################

//   const previewCanvas = document.createElement("canvas");
//   const previewCtx = previewCanvas.getContext("2d")!;

//   const PREVIEW_WIDTH = 400;
//   const previewScale = PREVIEW_WIDTH / img.width;

//   previewCanvas.width = PREVIEW_WIDTH;
//   previewCanvas.height = img.height * previewScale;

//   previewCtx.drawImage(
//     img,
//     0,
//     0,
//     previewCanvas.width,
//     previewCanvas.height
//   );

//   const previewBlob: Blob = await new Promise(resolve =>
//     previewCanvas.toBlob(
//       b => resolve(b!),
//       "image/jpeg",
//       0.5
//     )
//   );



// // ######################################################################


//   // 6️⃣ Generate local preview
//   const previewUrl = URL.createObjectURL(uploadBlob);

//   return {
//     previewUrl,
//     uploadBlob,
//     width: targetWidth,
//     height: targetHeight,
//     sizeKB: Math.round(uploadBlob.size / 1024),
//   };
// }

// /* ----------------------------------------
//    SUPABASE UPLOAD HELPER
// ----------------------------------------- */

// export async function uploadProcessedImage(
//   blob: Blob,
//   supabase: any,
//   bucket: string,
//   path: string
// ): Promise<string> {
//   const { error } = await supabase.storage
//     .from(bucket)
//     .upload(path, blob, {
//       contentType: "image/jpeg",
//       upsert: true,
//     });

//   if (error) {
//     throw new Error(error.message);
//   }

//   const { data } = supabase.storage
//     .from(bucket)
//     .getPublicUrl(path);

//   return data.publicUrl;
// }
