import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI;

export const initializeAi = (apiKey: string) => {
  // FIX: Initialize GoogleGenAI with a named apiKey parameter as required by the SDK.
  ai = new GoogleGenAI({ apiKey });
};

export const getChatbotResponse = async (history: string, prompt: string): Promise<string> => {
  if (!ai) {
    return "Lỗi: Gemini AI chưa được khởi tạo. Vui lòng cài đặt API Key.";
  }

  try {
    // FIX: Using ai.models.generateContent as per the latest SDK guidelines.
    // The model is set to 'gemini-2.5-flash' for general text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      // FIX: System instruction is provided to set the chatbot's persona.
      config: {
        systemInstruction: `You are Trí Tuệ Việt, a friendly and helpful AI assistant for Vietnamese students preparing for their university entrance exams.
        Your goal is to provide clear, concise, and accurate answers.
        Converse in Vietnamese.
        Here is the conversation history:\n${history}`
      },
      contents: prompt,
    });
    
    // FIX: Extracting text directly from the response object using the .text property.
    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "Rất tiếc, đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.";
  }
};

export const generateStudyPlan = async (details: {
  subject: string;
  duration: number;
  level: string;
  goal: string;
}): Promise<string> => {
  if (!ai) {
    return "Lỗi: Gemini AI chưa được khởi tạo. Vui lòng cài đặt API Key.";
  }
  const prompt = `Tạo một kế hoạch học tập chi tiết cho môn ${details.subject} trong ${details.duration} tuần.
Trình độ hiện tại của học sinh là ${details.level} và mục tiêu là "${details.goal}".
Kế hoạch nên bao gồm các chủ đề cần học mỗi tuần, gợi ý tài liệu tham khảo, và lịch ôn tập.
Vui lòng trình bày dưới dạng markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating study plan:", error);
    return "Rất tiếc, đã có lỗi xảy ra khi tạo kế hoạch học tập. Vui lòng thử lại sau.";
  }
};
