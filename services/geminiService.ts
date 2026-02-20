
import { GoogleGenAI, Type } from "@google/genai";
import { PLANETS } from "../constants";

// Always use the named parameter for apiKey and fetch it from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CACHE_KEY = 'solar_system_insights_cache';

const getCache = (): Record<string, string[]> => {
  const cached = localStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : {};
};

const setCache = (planetName: string, insights: string[]) => {
  const cache = getCache();
  cache[planetName] = insights;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const getPlanetInsights = async (planetName: string) => {
  const cache = getCache();
  if (cache[planetName]) {
    return cache[planetName];
  }

  try {
    /**
     * Use gemini-3-flash-preview for basic text tasks.
     * Use systemInstruction for defining the behavior and format.
     */
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Напиши 3 уникальных и удивительных научных факта о планете ${planetName} на русском языке.`,
      config: {
        systemInstruction: "Вы — научный эксперт. Напишите 3 уникальных и удивительных факта о планете на русском языке. Ответ должен быть в формате JSON: объект с ключом 'insights', значение которого — массив строк. Текст должен быть увлекательным и научно обоснованным.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["insights"],
          propertyOrdering: ["insights"]
        }
      }
    });

    /**
     * Correct way to extract text output from GenerateContentResponse is via the .text property.
     * Do not call text() as a method.
     */
    const text = response.text;
    if (!text) {
      throw new Error("Empty response from model");
    }

    const data = JSON.parse(text.trim());
    const insights = data.insights as string[];
    setCache(planetName, insights);
    return insights;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["Научные данные временно недоступны.", "Сигнал с орбиты потерян...", "Попробуйте позже."];
  }
};

export const prefetchAllInsights = async () => {
  const cache = getCache();
  const planetsToFetch = PLANETS.filter(p => !cache[p.name]);
  
  if (planetsToFetch.length === 0) return;

  // Process requests sequentially or in small batches to respect potential rate limits.
  for (const planet of planetsToFetch) {
    await getPlanetInsights(planet.name);
  }
};
