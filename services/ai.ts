import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. AI features will be disabled or mocked.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateJobDescription = async (title: string, department: string, operator: string): Promise<string> => {
  const ai = getAI();
  if (!ai) return "AI Configuration missing. Please set API_KEY.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a professional, concise job description (max 100 words) for a ${title} position in the ${department} department at ${operator}. Focus on key responsibilities.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating description.";
  }
};

export const suggestOnboardingTasks = async (positionTitle: string): Promise<string[]> => {
  const ai = getAI();
  if (!ai) return ["Complete HR Paperwork", "IT Equipment Setup"];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `List 5 key onboarding tasks for a new ${positionTitle}. Return only the task names as a comma-separated list, no numbering or extra text.`,
    });
    
    const text = response.text || "";
    return text.split(',').map(t => t.trim()).filter(t => t.length > 0);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return ["Error generating tasks"];
  }
};