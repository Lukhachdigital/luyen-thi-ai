import React from 'react';
import type { ViewType } from '../types';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import { MOCK_PROGRESS_DATA } from '../constants';

interface DashboardProps {
    setView: (view: ViewType) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md flex items-center space-x-4 border-l-4 border-blue-500">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const ActionCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; gradient: string; }> = ({ title, description, icon, onClick, gradient }) => (
    <button onClick={onClick} className={`relative p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-left w-full group text-white overflow-hidden ${gradient}`}>
        <div className="relative z-10">
            <div className="mb-4">
                {icon}
            </div>
            <p className="font-bold text-xl">{title}</p>
            <p className="text-sm opacity-80">{description}</p>
        </div>
    </button>
);

const ExamForecastCard: React.FC = () => {
    const percentage = 85;
    const strokeDashoffset = 283 * (1 - percentage / 100); // 283 is the circumference (2 * pi * 45)

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Dự báo kết quả thi</h3>
            <div className="flex flex-col items-center">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                        <circle
                            className="text-green-500"
                            strokeWidth="10"
                            strokeDasharray="283"
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-green-500">{percentage}%</span>
                    </div>
                </div>
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Khả năng <span className="font-semibold text-green-500">đậu</span> vào nguyện vọng 1 dựa trên tiến độ hiện tại.
                </p>
            </div>
        </div>
    );
};

const SuggestionsCard: React.FC = () => {
    const suggestions = [
        { title: 'Hình học không gian Oxy', subject: 'Toán' },
        { title: 'Tác phẩm "Vợ chồng A Phủ"', subject: 'Ngữ văn' },
        { title: 'Câu điều kiện loại 3', subject: 'Tiếng Anh' },
    ];
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Đề xuất bài ôn phù hợp năng lực</h3>
            <ul className="space-y-3">
                {suggestions.map((item, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.subject}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
    const statIconClasses = "h-6 w-6 text-blue-600 dark:text-blue-400";
    const actionIconClasses = "h-10 w-10 mb-4 opacity-80";

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard title="Luyện đề thi thử" description="Bắt đầu một bài thi thử mới" icon={<svg xmlns="http://www.w3.org/2000/svg" className={actionIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>} onClick={() => setView('mock-test')} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                <ActionCard title="Tạo kế hoạch học tập" description="Lên lịch trình ôn luyện với AI" icon={<svg xmlns="http://www.w3.org/2000/svg" className={actionIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>} onClick={() => setView('planner')} gradient="bg-gradient-to-br from-indigo-500 to-indigo-600" />
                <ActionCard title="Hỏi đáp AI" description="Giải đáp thắc mắc ngay lập tức" icon={<svg xmlns="http://www.w3.org/2000/svg" className={actionIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>} onClick={() => setView('chatbot')} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4 px-2">Biểu đồ tiến bộ</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_PROGRESS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                                    <YAxis stroke="currentColor" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                            borderColor: 'rgb(55, 65, 81)',
                                            borderRadius: '0.75rem',
                                            color: '#e5e7eb'
                                        }}
                                        itemStyle={{ color: '#e5e7eb' }}
                                        labelStyle={{ color: '#f9fafb', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="Điểm" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <SuggestionsCard />
                </div>

                <div className="space-y-6">
                    <ExamForecastCard />
                    <StatCard title="Đề đã luyện" value="12" icon={<svg xmlns="http://www.w3.org/2000/svg" className={statIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
                    <StatCard title="Điểm trung bình" value="7.8" icon={<svg xmlns="http://www.w3.org/2000/svg" className={statIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} />
                    <StatCard title="Ngày học liên tiếp" value="5" icon={<svg xmlns="http://www.w3.org/2000/svg" className={statIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
                </div>
            </div>
        </div>
    );
}