import { CartProduct } from '@/types/CartProduct';

interface SplitResult {
  products: string[];
  omitted: boolean;
}

/**
 * Splits an array of `CartProduct` objects into multiple JSON string chunks,
 * each not exceeding the specified maximum character length.
 *
 * - Any single product exceeding `maxChars` will be omitted.
 * - The total number of chunks is capped by `maxChunks`.
 * - Returns whether any product or chunk was omitted.
 *
 * @param products - The array of `CartProduct` objects to split.
 * @param maxChars - The maximum number of characters allowed per chunk (default is 500).
 * @param maxChunks - The maximum number of chunks to allow (default is Infinity).
 * @returns An object with `products` (valid JSON chunks) and `omitted` (whether anything was skipped).
 */
export const splitProducts = (
  products: CartProduct[],
  maxChars = 500,
  maxChunks = Infinity
): SplitResult => {
  const chunks: string[] = [];
  let currentChunk: CartProduct[] = [];
  let omitted = false;

  for (const product of products) {
    const single = JSON.stringify([product]);

    if (single.length > maxChars) {
      omitted = true;
      continue;
    }

    currentChunk.push(product);
    const json = JSON.stringify(currentChunk);

    if (json.length > maxChars) {
      currentChunk.pop();
      if (currentChunk.length > 0) {
        chunks.push(JSON.stringify(currentChunk));
      }
      if (chunks.length >= maxChunks) {
        omitted = true;
        break;
      }
      currentChunk = [product];
    }
  }

  if (currentChunk.length > 0) {
    if (chunks.length < maxChunks) {
      chunks.push(JSON.stringify(currentChunk));
    } else {
      omitted = true;
    }
  }

  return { products: chunks, omitted };
};
