
import React, { useState, useEffect } from 'react';
import type { MockQuestion } from '../types';

const ALL_MOCK_QUESTIONS: Record<string, MockQuestion[]> = {
    'Toán': [
        { id: 1, question: "Kết quả của phép tính 5 x (4 + 3) là gì?", options: ["23", "35", "12", "19"], answer: "35", explanation: "Theo quy tắc ưu tiên phép tính, ta tính trong ngoặc trước: 4 + 3 = 7. Sau đó, 5 * 7 = 35." },
        { id: 2, question: "Tìm x trong phương trình: 2x - 5 = 11", options: ["x = 6", "x = 8", "x = 3", "x = 16"], answer: "x = 8", explanation: "2x = 11 + 5 => 2x = 16 => x = 16 / 2 = 8." },
        { id: 3, question: "Diện tích của hình chữ nhật có chiều dài 8cm và chiều rộng 5cm là bao nhiêu?", options: ["13 cm²", "26 cm²", "40 cm²", "32 cm²"], answer: "40 cm²", explanation: "Diện tích hình chữ nhật = chiều dài x chiều rộng = 8 * 5 = 40 cm²." },
    ],
    'Ngữ văn': [
        { id: 1, question: "Tác phẩm 'Làng' của nhà văn Kim Lân được viết trong bối cảnh nào?", options: ["Trước Cách mạng tháng Tám", "Thời kỳ đầu của cuộc kháng chiến chống Pháp", "Sau khi hòa bình lập lại ở miền Bắc", "Thời kỳ kháng chiến chống Mỹ"], answer: "Thời kỳ đầu của cuộc kháng chiến chống Pháp", explanation: "Truyện ngắn 'Làng' được viết vào năm 1948, trong thời kỳ đầu của cuộc kháng chiến chống thực dân Pháp." },
        { id: 2, question: "Nhân vật chính trong tác phẩm 'Chiếc lược ngà' của Nguyễn Quang Sáng là ai?", options: ["Ông Hai", "Anh Sáu và bé Thu", "Lão Hạc", "Chị Dậu"], answer: "Anh Sáu và bé Thu", explanation: "Câu chuyện xoay quanh tình cha con sâu nặng của ông Sáu và bé Thu trong hoàn cảnh chiến tranh chia cắt." },
    ],
    'Tiếng Anh': [
        { id: 1, question: "Choose the correct word: 'She is interested ___ learning new languages.'", options: ["in", "on", "at", "with"], answer: "in", explanation: "The preposition 'in' is used after 'interested' to indicate the subject of interest." },
        { id: 2, question: "What is the past tense of the verb 'go'?", options: ["goed", "gone", "went", "goes"], answer: "went", explanation: "'Went' is the simple past tense of the irregular verb 'go'." },
    ],
    'Vật lí': [
        { id: 1, question: "Đơn vị của lực trong hệ SI là gì?", options: ["Joule (J)", "Watt (W)", "Pascal (Pa)", "Newton (N)"], answer: "Newton (N)", explanation: "Newton (N) là đơn vị đo lực trong Hệ đo lường quốc tế (SI)." }
    ],
    'Tin học': [
        { id: 1, question: "Đâu là một hệ điều hành máy tính phổ biến?", options: ["Microsoft Word", "Google Chrome", "Windows 10", "Adobe Photoshop"], answer: "Windows 10", explanation: "Windows 10 là một hệ điều hành được phát triển bởi Microsoft. Các lựa chọn khác là phần mềm ứng dụng." },
        { id: 2, question: "HTML là viết tắt của cụm từ nào?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"], answer: "Hyper Text Markup Language", explanation: "HTML là ngôn ngữ đánh dấu siêu văn bản, được sử dụng để tạo các trang web." },
    ],
    'Tiếng Pháp': [
        { id: 1, question: "'Bonjour' có nghĩa là gì trong tiếng Việt?", options: ["Tạm biệt", "Xin chào", "Cảm ơn", "Xin lỗi"], answer: "Xin chào", explanation: "'Bonjour' là một lời chào phổ biến trong tiếng Pháp, thường được sử dụng vào ban ngày." },
        { id: 2, question: "Thủ đô của nước Pháp là gì?", options: ["Marseille", "Lyon", "Nice", "Paris"], answer: "Paris", explanation: "Paris là thủ đô và là thành phố lớn nhất của Pháp." },
    ],
};

interface MockTestProps {
  subject: string | null;
}

export const MockTest: React.FC<MockTestProps> = ({ subject }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [activeQuestions, setActiveQuestions] = useState<MockQuestion[]>([]);

    useEffect(() => {
        if (subject) {
            const questionsForSubject = ALL_MOCK_QUESTIONS[subject] || [];
            setActiveQuestions(questionsForSubject.map(q => ({ ...q, userAnswer: undefined })));
        } else {
            setActiveQuestions([]);
        }
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
    }, [subject]);

    if (!subject) {
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                <h2 className="text-2xl font-bold mb-2">Vui lòng chọn một môn học</h2>
                <p className="text-gray-600 dark:text-gray-400">Quay lại Bảng điều khiển để bắt đầu luyện thi nhé.</p>
            </div>
        );
    }
    
    if (activeQuestions.length === 0) {
        return (
             <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Luyện đề thi thử - Môn {subject}</h2>
                <p>Hiện chưa có câu hỏi cho môn này. Vui lòng quay lại sau.</p>
            </div>
        )
    }

    const handleAnswer = (option: string) => {
        if (activeQuestions[currentQuestionIndex].userAnswer) return; // Prevent re-answering

        const newQuestions = [...activeQuestions];
        const currentQ = newQuestions[currentQuestionIndex];
        currentQ.userAnswer = option;
        
        if (option === currentQ.answer) {
            setScore(prevScore => prevScore + 1);
        }
        setActiveQuestions(newQuestions);

        const nextQuestion = currentQuestionIndex + 1;
        setTimeout(() => {
             if (nextQuestion < activeQuestions.length) {
                setCurrentQuestionIndex(nextQuestion);
            } else {
                setShowResult(true);
            }
        }, 1500); // Delay for user to see explanation
    };

    const restartTest = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setActiveQuestions(prev => prev.map(q => ({ ...q, userAnswer: undefined })));
    }

    if (showResult) {
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
                <h2 className="text-3xl font-bold mb-2">Hoàn thành bài thi môn {subject}!</h2>
                <p className="text-xl mb-6">Bạn đã trả lời đúng <span className="font-bold text-green-500">{score}</span> trên <span className="font-bold">{activeQuestions.length}</span> câu!</p>
                <button onClick={restartTest} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Làm lại</button>
            </div>
        )
    }

    const currentQuestion = activeQuestions[currentQuestionIndex];

    return (
        <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
             <h2 className="text-2xl font-bold mb-4 text-center">Luyện đề thi thử - Môn {subject}</h2>
            <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">Câu hỏi {currentQuestionIndex + 1}/{activeQuestions.length}</p>
                <h3 className="text-xl font-semibold mt-2">{currentQuestion.question}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                     const isSelected = currentQuestion.userAnswer === option;
                     const isCorrect = currentQuestion.answer === option;
                     
                     let buttonClass = 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/50';
                     if (currentQuestion.userAnswer) {
                         if (isCorrect) {
                             buttonClass = 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-white border-green-400';
                         } else if (isSelected && !isCorrect) {
                             buttonClass = 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-white border-red-400';
                         } else {
                            buttonClass = 'bg-gray-100 dark:bg-gray-700 opacity-60';
                         }
                     }
                    return (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={!!currentQuestion.userAnswer}
                            className={`w-full text-left p-4 rounded-lg transition-all duration-300 border-2 border-transparent ${buttonClass} disabled:cursor-not-allowed`}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
             {currentQuestion.userAnswer && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-yellow-400 animate-pulse-once">
                    <p className="font-bold text-yellow-800 dark:text-yellow-300">Giải thích:</p>
                    <p className="text-sm text-yellow-900 dark:text-yellow-200">{currentQuestion.explanation}</p>
                </div>
            )}
        </div>
    );
}
