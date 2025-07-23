import { geminiModel } from '../../constants/geminiConfig';

export async function getPopularSneakerTerms(query: string): Promise<string[]> {
  if (!query || query.trim().length === 0) return [];

  const prompt = `The user is typing a sneaker name and has entered: "${query}".
Suggest 3 popular sneaker names or models that begin with or include this input. Each suggestion should feel like a likely continuation of what they are typing.
Respond with only the full sneaker names, one per line, no extra text.`;

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
