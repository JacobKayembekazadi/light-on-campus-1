import { GoogleGenAI } from "@google/genai";
import { CourseCategory } from "../types";

// Lazy initialization of the Gemini AI client
let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI | null => {
  if (ai) return ai;

  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key not configured. AI features will be unavailable.");
    return null;
  }

  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error) {
    console.error("Failed to initialize Gemini AI:", error);
    return null;
  }
};

export const generateCourseOutline = async (topic: string, category: CourseCategory): Promise<string> => {
  const client = getAIClient();
  if (!client) {
    return "AI features require a Gemini API Key. Please configure your API key in .env.local file.";
  }

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

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate course content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with AI service. Please try again later.";
  }
};

export const getSpiritualCounsel = async (userMessage: string): Promise<string> => {
  const client = getAIClient();
  if (!client) {
    return "I am currently unavailable. Please ensure the AI service is configured properly.";
  }

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

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return response.text || "I am listening, but I cannot find the words right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Peace be with you. I am having trouble connecting right now.";
  }
};

export const generatePostDraft = async (topic: string, role: string): Promise<string> => {
  const client = getAIClient();
  if (!client) {
    return "AI Assist requires a Gemini API Key to be configured.";
  }

  try {
    const prompt = `Write a social media post for a church community app called 'Light On Campus'.
    User Role: ${role}
    Topic: ${topic}

    The tone should be engaging, relevant to university students, and spiritually uplifting. Use emojis sparingly.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error(error);
    return "Failed to generate post. Please try again.";
  }
};
