import { geminiModel } from './gemini';

export async function getPopularSneakerTerms(query: string): Promise<string[]> {
  if (!query || query.trim().length === 0) return [];

  const prompt = `Give me 3 popular sneakers that match or relate to the term "${query}". Only return the sneaker names, one per line, with no extra text.`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const terms = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (terms.length === 0) {
      throw new Error(`Empty or invalid AI response: "${text}"`);
    }

    return terms;
  } catch (error) {
    console.error('[GEMINI_ERROR]', error);
    return [];
  }
}
