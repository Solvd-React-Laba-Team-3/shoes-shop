'use server';

import { getPopularSneakerTerms } from '@/lib/ai/getPopularSneakerTerms';

export async function fetchPopularTerms(query: string): Promise<string[]> {
  if (!query.trim()) return [];
  return await getPopularSneakerTerms(query);
}
