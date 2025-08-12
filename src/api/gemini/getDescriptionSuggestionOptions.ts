import { geminiModel } from '../../constants/geminiConfig';

export async function getDescriptionSuggestion(
  name: string,
  description: string,
  gender: string,
  brand: string
): Promise<string> {
  const normalizedName = name.trim();
  const prompt = `
You are a product description generator for sneakers. Generate a compelling product description based on the available information below.

Product Information:
- Name: ${normalizedName || 'Not specified'}
- Current Description: ${description || 'None provided'}
- Gender: ${gender || 'Unisex'}
- Brand: ${brand || 'Generic'}

INSTRUCTIONS:
1. Generate a product description that is engaging and marketable
2. If specific details are missing, create realistic and appealing details for a sneaker
3. Focus on style, comfort, versatility, and quality
4. Include mentions of materials, design features, or use cases when appropriate
5. Keep the description between 100-350 characters
6. Write in a professional, marketing-friendly tone
7. DO NOT ask for more information - always generate a description with the available data

IMPORTANT: Always respond with ONLY the product description text, no additional commentary or requests for information.
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error(error);
    return description;
  }
}

export const getDescriptionSuggestionOptions = (
  name: string,
  productDescription: string,
  gender: string,
  brand: string
) => ({
  queryKey: [
    'getDescriptionSuggestion',
    name,
    productDescription,
    gender,
    brand,
  ],
  queryFn: () =>
    getDescriptionSuggestion(name, productDescription, gender, brand),
  enabled: false,
});
