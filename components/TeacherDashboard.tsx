
import React from 'react';

export const TeacherDashboard: React.FC = () => {
    return (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Tính năng bị vô hiệu hóa</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Chức năng đăng nhập đã được gỡ bỏ, do đó trang dành cho giáo viên không còn khả dụng.</p>
        </div>
    );
};
