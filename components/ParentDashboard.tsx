import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import { MOCK_PROGRESS_DATA } from '../constants';

export const ParentDashboard: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setFeedback('Vui lòng nhập địa chỉ email.');
            return;
        }
        setIsSending(true);
        setFeedback('');

        // Mock API call
        setTimeout(() => {
            setIsSending(false);
            setFeedback(`Đã gửi gợi ý ôn tập tới địa chỉ ${email}.`);
            setEmail('');
        }, 1500);
    };


    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Bảng theo dõi của Phụ huynh / Giáo viên</h2>

             <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 px-2">Biểu đồ tiến bộ của học sinh</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_PROGRESS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="parentChartColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                            <Area type="monotone" dataKey="Điểm" stroke="#10b981" fillOpacity={1} fill="url(#parentChartColor)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Nhận gợi ý ôn tập cho con qua Email</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    AI sẽ phân tích kết quả học tập và gửi một email tóm tắt cùng với các gợi ý về chủ đề con bạn nên tập trung ôn luyện trong tuần tới.
                </p>
                <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row items-start gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email phụ huynh/giáo viên"
                        className="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        aria-label="Parent or teacher email"
                    />
                    <button
                        type="submit"
                        disabled={isSending}
                        className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isSending ? 'Đang gửi...' : 'Gửi ngay'}
                    </button>
                </form>
                {feedback && <p className="text-sm text-green-600 dark:text-green-400 mt-3">{feedback}</p>}
            </div>
        </div>
    );
};

