export const mockGetPopularSneakerTerms = jest.fn();

jest.mock('@/api/gemini/getPopularSneakerTerms', () => ({
  getPopularSneakerTerms: mockGetPopularSneakerTerms,
}));
