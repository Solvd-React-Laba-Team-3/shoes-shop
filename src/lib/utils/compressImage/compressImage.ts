/**
 * Configuration options for image compression
 * @interface CompressionOptions
 */
export interface CompressionOptions {
  /** Maximum dimension (width or height) in pixels */
  maxDimension?: number;
  /** JPEG compression quality (0-1) */
  quality?: number;
  /** Output format (default: 'image/jpeg') */
  outputFormat?: string;
}

/**
 * Default compression options
 */
const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxDimension: 1920,
  quality: 0.8,
  outputFormat: 'image/jpeg',
};

/**
 * Compresses an image file by resizing and reducing quality
 *
 * @param file - The image file to compress
 * @param options - Compression configuration options
 * @returns Promise resolving to a compressed image Blob
 *
 * @throws {Error} If canvas context cannot be obtained
 * @throws {Error} If image fails to load
 * @throws {Error} If compression fails
 *
 * @example
 * ```typescript
 * // Basic usage with defaults
 * const compressed = await compressImage(file);
 *
 * // Custom options
 * const compressed = await compressImage(file, {
 *   maxDimension: 1280,
 *   quality: 0.9,
 *   outputFormat: 'image/webp'
 * });
 * ```
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<Blob> => {
  const { maxDimension, quality, outputFormat } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      let width = img.width;
      let height = img.height;

      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        outputFormat,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
  });
};
