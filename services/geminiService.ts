import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_PROGRESS_DATA } from '../constants';
import type { LearningProfile } from '../types';

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

export const generateLearningProfile = async (): Promise<LearningProfile> => {
  if (!ai) {
    throw new Error("Lỗi: Gemini AI chưa được khởi tạo. Vui lòng cài đặt API Key.");
  }

  const progressString = MOCK_PROGRESS_DATA.map(d => `${d.name}: ${d['Điểm']} điểm`).join(', ');

  const prompt = `Dựa trên dữ liệu tiến bộ học tập sau đây của một học sinh lớp 9 tại Việt Nam: "${progressString}".
  Hãy tạo một hồ sơ năng lực học tập cho học sinh này. Dữ liệu thể hiện điểm số qua các tuần.
  Phân tích dữ liệu để xác định:
  1. Hai (2) điểm mạnh, có thể là các chủ đề hoặc kỹ năng mà học sinh có vẻ đang làm tốt.
  2. Hai (2) điểm yếu, các lĩnh vực cần cải thiện.
  3. Ba (3) đề xuất cụ thể, hành động mà học sinh nên làm trong tuần tới để cải thiện.
  4. Một (1) câu động viên ngắn gọn, tích cực và cá nhân hóa dựa trên sự tiến bộ.
  Hãy sáng tạo và đưa ra các phỏng đoán hợp lý về các chủ đề môn học (Toán, Văn, Anh) dựa trên điểm số.
  Ví dụ, điểm số tăng có thể là điểm mạnh về "Khả năng tiếp thu kiến thức mới". Điểm số giảm có thể là điểm yếu về "Ôn tập kiến thức cũ".
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
            strengths: {
              type: Type.ARRAY,
              description: 'Danh sách các điểm mạnh.',
              items: {
                type: Type.OBJECT,
                properties: {
                  subject: { type: Type.STRING, description: "Tên môn học hoặc kỹ năng chung." },
                  topic: { type: Type.STRING, description: "Mô tả chi tiết về điểm mạnh." }
                }
              }
            },
            weaknesses: {
              type: Type.ARRAY,
              description: 'Danh sách các điểm yếu.',
              items: {
                type: Type.OBJECT,
                properties: {
                  subject: { type: Type.STRING, description: "Tên môn học hoặc kỹ năng chung." },
                  topic: { type: Type.STRING, description: "Mô tả chi tiết về điểm yếu." }
                }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              description: 'Danh sách các đề xuất cho tuần tới.',
              items: { type: Type.STRING }
            },
            motivationalQuote: {
              type: Type.STRING,
              description: 'Câu động viên cá nhân hóa.'
            }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const profileData: LearningProfile = JSON.parse(jsonText);
    return profileData;

  } catch (error) {
    console.error("Error generating learning profile:", error);
    // Fallback to mock data if AI fails
    return {
      strengths: [
        { subject: "Sự kiên trì", topic: "Duy trì lịch học ổn định qua các tuần." },
        { subject: "Toán", topic: "Có sự cải thiện rõ rệt về điểm số ở các tuần cuối." }
      ],
      weaknesses: [
        { subject: "Ngữ văn", topic: "Điểm số có lúc trồi sụt, cần củng cố kiến thức nền." },
        { subject: "Sự ổn định", topic: "Phong độ chưa thực sự ổn định, cần tập trung hơn." }
      ],
      recommendations: [
        "Dành 2 giờ cuối tuần để xem lại các lỗi sai trong các bài kiểm tra tuần trước.",
        "Luyện thêm 1 đề thi thử môn Ngữ văn để cải thiện kỹ năng viết.",
        "Đọc và tóm tắt một tác phẩm văn học trọng tâm."
      ],
      motivationalQuote: "Bạn đang tiến bộ rất tốt, hãy tiếp tục phát huy nhé!"
    };
  }
};
