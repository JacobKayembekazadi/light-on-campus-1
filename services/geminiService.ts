import { GoogleGenAI } from "@google/genai";
import { CourseCategory } from "../types";

// Initialize the Gemini AI client
// Note: In a real production app, ensure API_KEY is set in environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCourseOutline = async (topic: string, category: CourseCategory): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing. Please configure your Google Gemini API Key.";

  try {
    const prompt = `Create a detailed course outline for a church online learning platform.
    Topic: ${topic}
    Category: ${category}
    Target Audience: Youth and Young Adults (Campus students).
    
    Structure the response as a markdown document with:
    1. Course Title
    2. Brief Description
    3. Learning Objectives (Bullet points)
    4. Week-by-Week Breakdown (4 weeks), with 2 lessons per week.
    
    Keep the tone inspiring, educational, and spiritually grounded.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Failed to generate course content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with AI service. Please try again later.";
  }
};

export const getSpiritualCounsel = async (userMessage: string): Promise<string> => {
  if (!process.env.API_KEY) return "I am unable to connect to the server right now. Please pray and try again later.";

  try {
    const prompt = `You are a compassionate, wise, and biblically grounded spiritual counselor assistant for 'Light On Campus' ministry.
    The user is asking: "${userMessage}"
    
    Provide a response that is:
    1. Empathetic and listening.
    2. Rooted in biblical wisdom (quote a relevant scripture if applicable).
    3. Practical advice for a young person/student.
    4. Encouraging prayer.
    
    Keep it concise (under 150 words) but impactful.
    Disclaimer: Start by saying you are an AI assistant if the topic is severe (suicide/abuse) and recommend professional help immediately.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "I am listening, but I cannot find the words right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Peace be with you. I am having trouble connecting right now.";
  }
};

export const generatePostDraft = async (topic: string, role: string): Promise<string> => {
  if (!process.env.API_KEY) return "Please set API Key.";

  try {
    const prompt = `Write a social media post for a church community app called 'Light On Campus'.
    User Role: ${role}
    Topic: ${topic}
    
    The tone should be engaging, relevant to university students, and spiritually uplifting. Use emojis sparingly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error(error);
    return "";
  }
};