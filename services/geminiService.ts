import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from '../types';

let ai: GoogleGenAI | null = null;

/**
 * Initializes the GoogleGenAI client with the user-provided API key.
 * @param apiKey The API key provided by the user.
 */
export const initializeAi = (apiKey: string): void => {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  } else {
    console.warn("Luyện Thi Vào 10 AI Warning: An empty API key was provided.");
    ai = null;
  }
};

/**
 * Checks if the AI client has been initialized.
 * @returns {boolean} True if initialized, false otherwise.
 */
export const isAiInitialized = (): boolean => ai !== null;


const mockTestSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "An array of 5 multiple-choice questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The question text.",
                    },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4 possible answers.",
                        items: { type: Type.STRING },
                    },
                    correctAnswer: {
                        type: Type.STRING,
                        description: "The correct answer from the options.",
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A detailed explanation for the correct answer.",
                    },
                },
                required: ["question", "options", "correctAnswer", "explanation"],
            },
        },
    },
    required: ["questions"],
};

const missingApiKeyError = (): Question[] => {
    return [{
        question: "Lỗi Cấu Hình Dịch Vụ AI",
        options: [],
        correctAnswer: "",
        explanation: "Vui lòng nhập API Key của bạn để sử dụng các tính năng AI. Bạn có thể nhấn vào biểu tượng chìa khóa ở góc trên bên phải để cài đặt."
    }];
};

export const generateMockTest = async (subject: string): Promise<Question[]> => {
    if (!isAiInitialized() || !ai) {
        return missingApiKeyError();
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a 5-question multiple-choice mock test for a 10th-grade entrance exam in the subject of ${subject}. The questions should be of medium difficulty.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: mockTestSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed.questions || [];

    } catch (error) {
        console.error("Error generating mock test:", error);
        return [{
            question: "Đã có lỗi xảy ra khi tạo đề thi. Vui lòng thử lại.",
            options: [],
            correctAnswer: "",
            explanation: `Lỗi: ${error instanceof Error ? error.message : String(error)}`,
        }];
    }
};


export const getChatbotResponse = async (history: string, userMessage: string): Promise<string> => {
    if (!isAiInitialized() || !ai) {
        return "Xin lỗi, dịch vụ AI hiện không khả dụng. Vui lòng kiểm tra lại cài đặt API Key của bạn.";
    }
    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${history}\nUser: ${userMessage}\nAI:`,
             config: {
                systemInstruction: "You are a friendly and encouraging AI tutor for Vietnamese students preparing for their 10th-grade entrance exam. Your name is 'Trí Tuệ Việt'. Provide clear, concise answers and explanations. Always be positive and supportive. Answer in Vietnamese.",
                temperature: 0.7,
                topP: 0.9,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.";
    }
};

export const generateStudyPlan = async (strengths: string[], weaknesses: string[]): Promise<string> => {
    if (!isAiInitialized() || !ai) {
        return "## Kế hoạch học tập\n\nXin lỗi, không thể tạo kế hoạch học tập do dịch vụ AI chưa được cấu hình. Vui lòng kiểm tra lại cài đặt API Key của bạn.";
    }
    const prompt = `
        Create a smart, 1-week study plan for a Vietnamese student preparing for their 10th-grade entrance exam.
        The plan should be detailed, actionable, and encouraging.
        
        Student Profile:
        - Strengths: ${strengths.join(', ')}
        - Weaknesses: ${weaknesses.join(', ')}
        
        Instructions:
        1.  Create a day-by-day schedule from Monday to Sunday.
        2.  Focus more time on the weak subjects, but still include revision for strong subjects.
        3.  Incorporate short breaks and a rest day (Sunday).
        4.  Suggest specific topics or types of exercises for each study session.
        5.  Use markdown for formatting, with headings for each day.
        6.  The response must be in Vietnamese.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error generating study plan:", error);
        return "## Kế hoạch học tập\n\nXin lỗi, đã có lỗi xảy ra khi tạo kế hoạch học tập. Vui lòng thử lại.";
    }
};
