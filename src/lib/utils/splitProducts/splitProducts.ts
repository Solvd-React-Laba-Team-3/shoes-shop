import { CartProduct } from '@/types/CartProduct';

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
