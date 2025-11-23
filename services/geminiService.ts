import { GoogleGenAI, Type } from "@google/genai";
import { StudentRecord, ColumnStats, AIAnalysisResult } from '../types';

const getGeminiClient = () => {
    // This expects the API key to be available in process.env.API_KEY
    if (!process.env.API_KEY) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeStudentData = async (
  stats: ColumnStats[],
  sampleData: StudentRecord[]
): Promise<AIAnalysisResult> => {
  const ai = getGeminiClient();
  
  const prompt = `
    You are an expert Data Scientist specializing in Educational Analytics.
    
    Here is a statistical summary of a college class performance:
    ${JSON.stringify(stats, null, 2)}

    Here is a sample of the raw student data (first few rows):
    ${JSON.stringify(sampleData.slice(0, 10), null, 2)}

    Please perform a comprehensive analysis for the college management.
    1. Provide a high-level summary of the class performance.
    2. Identify 3-5 key trends or anomalies (e.g., correlation between attendance and grades, specific subjects students struggle with).
    3. Suggest actionable recommendations for the faculty to improve performance.
    4. Generate a Python script using pandas and matplotlib that the college can run locally to visualize this exact data (assume CSV input).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyTrends: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            pythonScript: { type: Type.STRING, description: "Complete, runnable python code" }
          },
          required: ["summary", "keyTrends", "recommendations", "pythonScript"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};