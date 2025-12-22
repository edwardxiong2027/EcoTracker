
import { GoogleGenAI, Type } from "@google/genai";
import { EcoLog, EcoAdvice } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDailyEcoAdvice = async (logs: EcoLog[]): Promise<EcoAdvice> => {
  const recentLog = logs[logs.length - 1];
  const history = logs.slice(-5).map(l => `${l.date}: ${l.transport.type} (${l.transport.distanceKm}km), ${l.food}`).join('\n');

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze my recent carbon footprint logs and give me a helpful daily tip. 
    History:\n${history}\n
    Latest entry: ${recentLog ? `${recentLog.transport.type}, ${recentLog.food}` : 'None'}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tip: { type: Type.STRING, description: "A catchy, actionable eco-tip." },
          impactScore: { type: Type.NUMBER, description: "A score from 1-100 on how green the user is currently." },
          analysis: { type: Type.STRING, description: "Short explanation of the score." }
        },
        required: ["tip", "impactScore", "analysis"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as EcoAdvice;
  } catch (e) {
    return {
      tip: "Try walking more for short distances to reduce your footprint!",
      impactScore: 70,
      analysis: "Keep up the good work on your plant-based diet!"
    };
  }
};
