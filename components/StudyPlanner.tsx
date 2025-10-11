import React, { useState, useCallback } from 'react';
import { generateStudyPlan } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-3 text-md font-semibold text-gray-700 dark:text-gray-300">AI đang xây dựng kế hoạch học tập tối ưu cho bạn...</p>
    </div>
);

// A simple markdown parser to convert markdown-like text to HTML
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    const content = lines.map((line, index) => {
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-blue-500">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-bold mt-6 mb-3 border-b-2 border-blue-500 pb-1">{line.substring(3)}</h2>;
        }
        if (line.startsWith('* ')) {
            return <li key={index} className="ml-6 list-disc">{line.substring(2)}</li>;
        }
        if (line.trim() === '') {
            return <br key={index} />;
        }
        return <p key={index} className="mb-1">{line}</p>;
    }).reduce((acc, el, index) => {
        if (el.type === 'li' && (index === 0 || acc[acc.length - 1].type !== 'ul')) {
            acc.push(<ul key={`ul-${index}`} className="space-y-1">{el}</ul>);
        } else if (el.type === 'li') {
            const lastUl = acc[acc.length - 1];
            // This is a simplified version, for a real app, a proper markdown library is better
            const children = React.Children.toArray(lastUl.props.children);
            children.push(el);
            acc[acc.length - 1] = React.cloneElement(lastUl, { children });
        } else {
            acc.push(el);
        }
        return acc;
    // FIX: To fix errors with accessing props and cloning elements, the accumulator type is made more specific.
    // This ensures TypeScript knows about the `children` prop.
    }, [] as React.ReactElement<{ children?: React.ReactNode }>[]);

    return <>{content}</>;
};

export const StudyPlanner: React.FC = () => {
    const [plan, setPlan] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    
    // Mock user data. In a real app, this would come from user's profile/performance data.
    const strengths = ['Tiếng Anh (Ngữ pháp)', 'Ngữ văn (Nghị luận xã hội)'];
    const weaknesses = ['Toán (Hình học không gian)', 'Vật lý (Điện học)'];

    const handleGeneratePlan = useCallback(async () => {
        setIsLoading(true);
        setGenerated(false);
        const generatedPlan = await generateStudyPlan(strengths, weaknesses);
        setPlan(generatedPlan);
        setIsLoading(false);
        setGenerated(true);
    }, [strengths, weaknesses]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold">Kế hoạch học tập thông minh</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Để AI tạo ra một lịch trình học tập hàng tuần được cá nhân hóa cho bạn.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Thông tin học tập của bạn:</h3>
                <p className="text-sm"><strong className="text-green-600 dark:text-green-400">Điểm mạnh:</strong> {strengths.join(', ')}</p>
                <p className="text-sm"><strong className="text-red-600 dark:text-red-400">Cần cải thiện:</strong> {weaknesses.join(', ')}</p>
            </div>

            <div className="text-center mb-6">
                <button
                    onClick={handleGeneratePlan}
                    disabled={isLoading}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                     {isLoading ? 'Đang tạo...' : 'Tạo kế hoạch cho tôi'}
                </button>
            </div>
            
            {isLoading && <LoadingSpinner />}

            {generated && !isLoading && plan && (
                <div className="prose prose-blue dark:prose-invert max-w-none p-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                   <SimpleMarkdown text={plan} />
                </div>
            )}
        </div>
    );
};
