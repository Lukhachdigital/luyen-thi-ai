
import React, { useState, useEffect, useCallback } from 'react';
import { generateMockTest } from '../services/geminiService';
import { SUBJECTS } from '../constants';
import type { Question, MockTestResult } from '../types';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg font-semibold">AI đang tạo đề thi cho bạn...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Vui lòng chờ trong giây lát.</p>
    </div>
);

const ResultScreen: React.FC<{ result: MockTestResult; onRetry: () => void }> = ({ result, onRetry }) => {
    const { score, total, answers } = result;
    const percentage = total > 0 ? (score / total) * 100 : 0;
    const getResultColor = () => {
        if (percentage >= 80) return 'text-green-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">Kết quả bài thi</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Đây là kết quả chi tiết của bạn.</p>
            <div className={`text-5xl font-bold text-center mb-6 ${getResultColor()}`}>
                {score} / {total}
            </div>
            <div className="space-y-4 mb-6">
                {answers.map(({ question, userAnswer }, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                        <p className="font-semibold">{index + 1}. {question.question}</p>
                        <p className={`text-sm mt-2 ${userAnswer === question.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            Câu trả lời của bạn: {userAnswer || "Chưa trả lời"}
                        </p>
                        <p className="text-sm mt-1 text-blue-600 dark:text-blue-400">Đáp án đúng: {question.correctAnswer}</p>
                        <details className="mt-2 text-sm">
                            <summary className="cursor-pointer text-gray-600 dark:text-gray-400">Xem giải thích</summary>
                            <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-600 rounded">{question.explanation}</p>
                        </details>
                    </div>
                ))}
            </div>
            <div className="text-center">
                <button onClick={onRetry} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    Làm lại
                </button>
            </div>
        </div>
    );
};

export const MockTest: React.FC = () => {
    const [testState, setTestState] = useState<'selecting' | 'loading' | 'active' | 'finished'>('selecting');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [result, setResult] = useState<MockTestResult | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string>('');

    const startTest = useCallback(async (subject: string) => {
        setSelectedSubject(subject);
        setTestState('loading');
        const generatedQuestions = await generateMockTest(subject);
        if (generatedQuestions.length > 0 && generatedQuestions[0].options.length > 0) {
            setQuestions(generatedQuestions);
            setUserAnswers(new Array(generatedQuestions.length).fill(''));
            setCurrentQuestionIndex(0);
            setTimeLeft(generatedQuestions.length * 60); // 1 minute per question
            setTestState('active');
        } else {
             // Handle error case from Gemini service
            setQuestions(generatedQuestions);
            setTestState('finished');
            setResult({
                score: 0,
                total: 0,
                answers: [{ question: generatedQuestions[0], userAnswer: 'N/A'}]
            })
        }
    }, []);

    const handleAnswerSelect = (answer: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);
    };

    const finishTest = useCallback(() => {
        let score = 0;
        const finalAnswers = questions.map((q, i) => {
            if (userAnswers[i] === q.correctAnswer) {
                score++;
            }
            return { question: q, userAnswer: userAnswers[i] };
        });
        setResult({ score, total: questions.length, answers: finalAnswers });
        setTestState('finished');
    }, [questions, userAnswers]);


    useEffect(() => {
        if (testState === 'active' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (testState === 'active' && timeLeft === 0) {
            finishTest();
        }
    }, [testState, timeLeft, finishTest]);

    const resetTest = () => {
        setTestState('selecting');
        setQuestions([]);
        setResult(null);
        setSelectedSubject('');
    };
    
    const currentQuestion = questions[currentQuestionIndex];

    if (testState === 'selecting') {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6">Chọn môn thi</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {SUBJECTS.map(subject => (
                        <button key={subject.name} onClick={() => startTest(subject.name)} className={`${subject.color} text-white font-bold py-4 px-2 rounded-lg hover:opacity-90 transition-opacity`}>
                            {subject.name}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    
    if (testState === 'loading') return <LoadingSpinner />;
    if (testState === 'finished' && result) return <ResultScreen result={result} onRetry={resetTest} />;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Môn: {selectedSubject}</h2>
                <div className="text-lg font-semibold bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-4 py-1 rounded-full">
                    {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
                </div>
            </div>

            {currentQuestion && (
                <div>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">Câu {currentQuestionIndex + 1}/{questions.length}</p>
                    <p className="text-lg font-semibold mb-6">{currentQuestion.question}</p>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleAnswerSelect(option)}
                                className={`block w-full text-left p-4 rounded-lg border-2 transition-colors ${userAnswers[currentQuestionIndex] === option ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-between mt-8">
                <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
                >
                    Trước
                </button>
                {currentQuestionIndex === questions.length - 1 ? (
                    <button
                        onClick={finishTest}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700"
                    >
                        Nộp bài
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
                    >
                        Tiếp
                    </button>
                )}
            </div>
        </div>
    );
};
