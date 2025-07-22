import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error('GOOGLE_API_KEY is not defined.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});
