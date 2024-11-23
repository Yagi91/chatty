import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable
export const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_KEY as string
);
