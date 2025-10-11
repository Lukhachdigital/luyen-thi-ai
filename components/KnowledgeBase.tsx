import React from 'react';

interface KnowledgeBaseProps {
  subject: string | null;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ subject }) => {
    if (!subject) {
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <h2 className="text-2xl font-bold mb-2">Vui lòng chọn một môn học</h2>
                <p className="text-gray-600 dark:text-gray-400">Quay lại Bảng điều khiển để xem nội dung kiến thức nhé.</p>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Kiến thức trọng tâm - Môn {subject}</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p>Nội dung kiến thức cốt lõi cho môn <strong>{subject}</strong> đang được đội ngũ chuyên gia của chúng tôi biên soạn và sẽ sớm được cập nhật.</p>
                <p>Phần này sẽ bao gồm:</p>
                <ul>
                    <li>Tổng hợp lý thuyết theo từng chuyên đề.</li>
                    <li>Các công thức quan trọng cần ghi nhớ.</li>
                    <li>Ví dụ minh họa chi tiết.</li>
                    <li>Sơ đồ tư duy giúp hệ thống hóa kiến thức.</li>
                </ul>
                <p>Vui lòng quay lại sau. Cảm ơn bạn đã kiên nhẫn!</p>
            </div>
        </div>
    );
};

