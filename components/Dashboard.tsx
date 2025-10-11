
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MOCK_PROGRESS_DATA, SUBJECTS, AI_RECOMMENDATIONS } from '../constants';
import type { ViewType } from '../types';

const SubjectCard: React.FC<{ name: string; icon: string; color: string; progress: number, onClick: () => void }> = ({ name, icon, color, progress, onClick }) => (
    <div onClick={onClick} className={`p-4 rounded-xl shadow-md cursor-pointer transition-transform transform hover:-translate-y-1 ${color}`}>
        <div className="flex justify-between items-start">
            <div className="text-white">
                <h3 className="text-lg font-bold">{name}</h3>
                <p className="text-sm opacity-80">Tiến độ</p>
            </div>
            {/* Simple icon mapping */}
            <div className="text-white text-3xl opacity-50">
              {icon === 'calculator' && '🧮'}
              {icon === 'book' && '📖'}
              {icon === 'globe' && '🌍'}
              {icon === 'atom' && '⚛️'}
              {icon === 'flask' && '🧪'}
              {icon === 'map' && '🗺️'}
            </div>
        </div>
        <div className="w-full bg-white/30 rounded-full h-2.5 mt-4">
            <div className="bg-white h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-right text-white text-xs mt-1">{progress}% Hoàn thành</p>
    </div>
);

const ProgressChart: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Biểu đồ tiến bộ</h3>
         <ResponsiveContainer width="100%" height={300}>
            <LineChart data={MOCK_PROGRESS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[5, 10]}/>
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                        borderColor: '#4b5563',
                        borderRadius: '0.5rem'
                    }} 
                    labelStyle={{ color: '#f9fafb' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Toán" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Ngữ văn" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Tiếng Anh" stroke="#22c55e" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export const Dashboard: React.FC<{ setView: (view: ViewType) => void }> = ({ setView }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ProgressChart />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg space-y-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">AI Gợi ý</h3>
                    <ul className="space-y-3">
                        {AI_RECOMMENDATIONS.map((rec, index) => (
                            <li key={index} className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                                <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4">Môn học</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {SUBJECTS.map((subject) => (
                        <SubjectCard 
                          key={subject.name} {...subject} 
                          onClick={() => setView('mock-test')} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
