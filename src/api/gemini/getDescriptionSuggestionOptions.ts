import { geminiModel } from '../../constants/geminiConfig';

export async function getDescriptionSuggestion(
  name: string,
  description: string,
  gender: string,
  brand: string
): Promise<string> {
  const normalizedName = name.trim();
  const prompt = `
You are a product description generator for sneakers. Generate a 100–350 character professional, marketing-friendly sneaker description based on the available information below.
- Name: ${normalizedName || 'Not specified'}
- Current Description: ${description || 'None provided'}
- Gender: ${gender || 'Unisex'}
- Brand: ${brand || 'Generic'}
If details are missing, create realistic, appealing one description. Focus on style, comfort, versatility, quality, materials, design features, and use cases. Always respond with ONLY the product description text, no additional commentary or requests for information.
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
