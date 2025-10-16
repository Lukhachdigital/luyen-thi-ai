

import React from 'react';
import { ProfileLookupByEmail } from './ProfileLookupByEmail';
import { MyProfile } from './MyProfile';

export const TeacherDashboard: React.FC = () => {
    // Teacher is logged in
    return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bảng điều khiển Giáo viên</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Chế độ truy cập công khai</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfileLookupByEmail />
                <MyProfile />
            </div>
        </div>
    );
};
