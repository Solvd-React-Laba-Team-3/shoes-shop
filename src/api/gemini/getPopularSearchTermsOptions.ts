import { geminiModel } from '../../constants/geminiConfig';

export async function getPopularSearchTerms(query: string): Promise<string[]> {
  const normalizedQuery = (query ?? '').toString().trim();
  const isEmpty = normalizedQuery.length === 0;
  const currentYear = new Date().getFullYear();

  const prompt = isEmpty
    ? `Give me a list of 3 sneaker models that are currently among the most popular and trending in ${currentYear}. Focus on hype, resale value, or cultural relevance.
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
      .map((line: string) => line.trim())
      .filter(Boolean);

    return terms;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const getPopularSearchTermsOptions = (debouncedInput: string) => ({
  queryKey: ['searchPopularTerms', debouncedInput],
  queryFn: () => getPopularSearchTerms(debouncedInput),
});
