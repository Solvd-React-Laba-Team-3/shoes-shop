import { CartProduct } from '@/types/CartProduct';

/**
 * Splits an array of `CartProduct` objects into multiple JSON string chunks,
 * each not exceeding the specified maximum character length.
 *
 * Each chunk is a JSON string representing an array of `CartProduct` objects.
 * The function ensures that no chunk exceeds the `maxChars` limit by
 * serializing the current chunk and checking its length before adding a new product.
 *
 * @param products - The array of `CartProduct` objects to split.
 * @param maxChars - The maximum number of characters allowed per chunk (default is 500).
 * @returns An array of JSON strings, each representing a chunk of products.
 */
export function splitProducts(products: CartProduct[], maxChars = 500) {
  const chunks: string[] = [];
  let currentChunk: CartProduct[] = [];

  for (const product of products) {
    currentChunk.push(product);
    const json = JSON.stringify(currentChunk);

    if (json.length > maxChars) {
      currentChunk.pop();
      chunks.push(JSON.stringify(currentChunk));
      currentChunk = [product];
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(JSON.stringify(currentChunk));
  }

  return chunks;
}
