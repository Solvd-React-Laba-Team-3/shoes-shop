import { geminiModel } from '../../constants/geminiConfig';

export async function getPopularSneakerTerms(query: string): Promise<string[]> {
  const normalizedQuery = (query ?? '').toString().trim();
  const isEmpty = normalizedQuery === '';

  const prompt = isEmpty
    ? `Give me a list of 3 sneaker models that are currently among the most popular and trending in 2025. Focus on hype, resale value, or cultural relevance.
Respond with only the full sneaker names, one per line. No extra text.`
    : `The user is typing a sneaker name and has entered: "${normalizedQuery}".
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

    return terms;
  } catch {
    return [];
  }
}
