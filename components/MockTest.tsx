import React, { useState } from 'react';
import type { MockQuestion } from '../types';

const MOCK_QUESTIONS: MockQuestion[] = [
    { id: 1, question: "Đâu là thủ đô của Việt Nam?", options: ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng"], answer: "Hà Nội", explanation: "Hà Nội là thủ đô của Việt Nam từ năm 1976." },
    { id: 2, question: "Sông nào dài nhất Việt Nam?", options: ["Sông Hồng", "Sông Cửu Long", "Sông Đồng Nai", "Sông Mã"], answer: "Sông Đồng Nai", explanation: "Nếu chỉ tính phần chảy trên lãnh thổ Việt Nam, sông Đồng Nai là dài nhất." },
    { id: 3, question: "Vua nào đã dời đô từ Hoa Lư về Thăng Long?", options: ["Lý Thái Tổ", "Trần Nhân Tông", "Lê Lợi", "Quang Trung"], answer: "Lý Thái Tổ", explanation: "Lý Thái Tổ (Lý Công Uẩn) đã dời đô vào năm 1010." },
];

export const MockTest: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [questions, setQuestions] = useState<MockQuestion[]>(MOCK_QUESTIONS.map(q => ({...q, userAnswer: undefined})));

    const handleAnswer = (option: string) => {
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].userAnswer = option;
        
        if (option === questions[currentQuestionIndex].answer) {
            setScore(score + 1);
        }
        setQuestions(newQuestions);

        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestionIndex(nextQuestion);
        } else {
            setShowResult(true);
        }
    };

    const restartTest = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setQuestions(MOCK_QUESTIONS.map(q => ({...q, userAnswer: undefined})));
    }

    if (showResult) {
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Kết quả</h2>
                <p className="text-xl mb-6">Bạn đã trả lời đúng {score} trên {questions.length} câu!</p>
                <button onClick={restartTest} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Làm lại</button>
            </div>
        )
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">Câu hỏi {currentQuestionIndex + 1}/{questions.length}</p>
                <h2 className="text-2xl font-bold mt-2">{currentQuestion.question}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="w-full text-left p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
