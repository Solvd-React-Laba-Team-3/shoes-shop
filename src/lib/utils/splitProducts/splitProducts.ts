import { StripeProduct } from '@/types/StripeProduct';

export function splitProducts(products: StripeProduct[], maxChars = 500) {
  const chunks: string[] = [];
  let currentChunk: StripeProduct[] = [];

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
