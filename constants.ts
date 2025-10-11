
import type { ProgressData, User } from './types';

export const MOCK_USER: User = {
    name: 'Minh Anh',
    avatarUrl: 'https://picsum.photos/100',
};

export const SUBJECTS = [
    { name: 'Toán', icon: 'calculator', color: 'bg-blue-500', progress: 75 },
    { name: 'Ngữ văn', icon: 'book', color: 'bg-red-500', progress: 60 },
    { name: 'Tiếng Anh', icon: 'globe', color: 'bg-green-500', progress: 85 },
    { name: 'Vật lý', icon: 'atom', color: 'bg-yellow-500', progress: 50 },
    { name: 'Hóa học', icon: 'flask', color: 'bg-purple-500', progress: 65 },
    { name: 'Địa lý', icon: 'map', color: 'bg-indigo-500', progress: 70 },
];

export const MOCK_PROGRESS_DATA: ProgressData[] = [
    { month: 'Tháng 1', 'Toán': 6.5, 'Ngữ văn': 7.0, 'Tiếng Anh': 7.5 },
    { month: 'Tháng 2', 'Toán': 7.0, 'Ngữ văn': 7.2, 'Tiếng Anh': 8.0 },
    { month: 'Tháng 3', 'Toán': 7.2, 'Ngữ văn': 7.5, 'Tiếng Anh': 8.2 },
    { month: 'Tháng 4', 'Toán': 7.8, 'Ngữ văn': 7.4, 'Tiếng Anh': 8.5 },
    { month: 'Tháng 5', 'Toán': 8.2, 'Ngữ văn': 8.0, 'Tiếng Anh': 9.0 },
];

export const AI_RECOMMENDATIONS = [
    "Tập trung vào chuyên đề 'Hình học không gian' môn Toán.",
    "Luyện thêm dạng bài 'Đọc hiểu' trong môn Ngữ văn.",
    "Ôn lại thì 'Hiện tại hoàn thành' trong Tiếng Anh."
];
