import React, { useState, useEffect } from 'react';
import { generateLearningProfile } from '../services/geminiService';
import type { LearningProfile as LearningProfileData } from '../types';

// Skeleton Loader Component
const ProfileSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2"></div>
        <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
        </div>
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
    </div>
);

// Individual card components for better structure
const StrengthCard: React.FC<{ item: { subject: string; topic: string } }> = ({ item }) => (
    <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg flex items-start space-x-3">
        <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <div>
            <p className="font-bold text-green-800 dark:text-green-300">{item.subject}</p>
            <p className="text-sm text-green-700 dark:text-green-400">{item.topic}</p>
        </div>
    </div>
);

const WeaknessCard: React.FC<{ item: { subject: string; topic: string } }> = ({ item }) => (
     <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg flex items-start space-x-3">
         <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <div>
            <p className="font-bold text-red-800 dark:text-red-300">{item.subject}</p>
            <p className="text-sm text-red-700 dark:text-red-400">{item.topic}</p>
        </div>
    </div>
);

export const LearningProfile: React.FC = () => {
    const [profile, setProfile] = useState<LearningProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const profileData = await generateLearningProfile();
                setProfile(profileData);
            } catch (err) {
                console.error("Failed to generate learning profile:", err);
                setError("Không thể tạo hồ sơ học tập. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (error) {
        return <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Hồ sơ năng lực học tập</h2>

            {profile?.motivationalQuote && (
                 <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                    <p className="text-xl font-semibold text-center italic">"{profile.motivationalQuote}"</p>
                </div>
            )}
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">Điểm mạnh</h3>
                    <div className="space-y-3">
                        {profile?.strengths.map((item, index) => <StrengthCard key={index} item={item} />)}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Điểm yếu cần cải thiện</h3>
                     <div className="space-y-3">
                        {profile?.weaknesses.map((item, index) => <WeaknessCard key={index} item={item} />)}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Đề xuất 3 việc nên làm trong tuần</h3>
                <ul className="space-y-3 list-disc list-inside">
                    {profile?.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                             <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m-5-5h10" /></svg>
                             <span>{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

