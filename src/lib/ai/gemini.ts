import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});
