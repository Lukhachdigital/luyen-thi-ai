import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { SimpleMarkdown } from './SimpleMarkdown';

export const StudyPlanner: React.FC = () => {
    const [subject, setSubject] = useState('Toán');
    const [duration, setDuration] = useState(12);
    const [level, setLevel] = useState('Trung bình');
    const [goal, setGoal] = useState('Đạt 9+ điểm trong kỳ thi THPT Quốc Gia');
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setPlan('');

        try {
            const result = await generateStudyPlan({ subject, duration, level, goal });
            setPlan(result);
        } catch (err) {
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-fit">
                <h2 className="text-2xl font-bold mb-6">Tạo Kế hoạch Học tập</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Môn học</label>
                        <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <option>Toán</option>
                            <option>Ngữ văn</option>
                            <option>Tiếng Anh</option>
                            <option>Vật lí</option>
                            <option>Hoá học</option>
                            <option>Sinh học</option>
                            <option>Lịch sử</option>
                            <option>Địa lí</option>
                            <option>Tin học</option>
                            <option>Tiếng Pháp</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thời gian (tuần)</label>
                        <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value, 10))} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trình độ hiện tại</label>
                        <input type="text" value={level} onChange={e => setLevel(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mục tiêu</label>
                        <textarea value={goal} onChange={e => setGoal(e.target.value)} rows={3} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"></textarea>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {isLoading ? 'Đang tạo...' : 'Tạo kế hoạch'}
                    </button>
                </form>
            </div>
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Kế hoạch của bạn</h3>
                <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none h-[calc(100vh-15rem)] overflow-y-auto">
                    {isLoading && <p>AI đang tạo kế hoạch, vui lòng chờ trong giây lát...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {plan ? <SimpleMarkdown content={plan} /> : !isLoading && <p>Nhập thông tin và nhấn "Tạo kế hoạch" để bắt đầu.</p>}
                </div>
            </div>
        </div>
    );
};