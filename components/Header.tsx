import React, { useState } from 'react';
import { MOCK_USER } from '../constants';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  onApiKeyClick: () => void;
  onSignOut: () => void;
}

const UserProfile: React.FC<{ user: User; onSignOut: () => void }> = ({ user, onSignOut }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
                <span className="hidden sm:inline-block text-right mr-3">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">Học sinh</span>
                </span>
                <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt="User avatar" />
            </button>
            {dropdownOpen && (
                <div 
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5"
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                    <button
                        onClick={() => { onSignOut(); setDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ user, onApiKeyClick, onSignOut }) => {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Chào mừng trở lại, {user ? user.name : MOCK_USER.name}!
            <span className="hidden sm:inline"> Cùng chinh phục mục tiêu hôm nay nhé!</span>
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>
        <button
          onClick={onApiKeyClick}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500"
          aria-label="Nhập API KEY"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7h2a2 2 0 012 2v4a2 2 0 01-2 2h-2m-2-4h.01M13 12h.01M11 12h.01M9 12h.01M4 7h2a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" />
          </svg>
          <span className="hidden sm:inline">Nhập API KEY</span>
        </button>
        {user ? (
            <UserProfile user={user} onSignOut={onSignOut} />
        ) : (
            <div className="flex items-center">
               <span className="hidden sm:inline-block text-right mr-3">
                 <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">{MOCK_USER.name}</span>
                 <span className="block text-xs text-gray-500 dark:text-gray-400">Học sinh</span>
               </span>
               <img className="h-10 w-10 rounded-full object-cover" src={MOCK_USER.avatarUrl} alt="Guest avatar" />
            </div>
        )}
      </div>
    </header>
  );
};