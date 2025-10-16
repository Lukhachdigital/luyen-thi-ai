
import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export const Login: React.FC = () => {
  const handleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged in App.tsx will handle the rest
    } catch (error) {
      console.error("Google sign-in error", error);
      alert('Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-900 font-sans p-4">
      <div className="w-full max-w-md text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <div className="font-bold text-blue-600 dark:text-blue-400 mb-4">
            <span className="block text-3xl uppercase tracking-wide">ỨNG DỤNG AI</span>
            <span className="block text-sm uppercase tracking-wider">HỖ TRỢ ÔN THI VÀO LỚP 10</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Đăng nhập để bắt đầu hành trình chinh phục kỳ thi vào lớp 10 với sự hỗ trợ của trí tuệ nhân tạo.
        </p>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path d="M1 1h22v22H1z" fill="none" /></svg>
          <span>Đăng nhập với Google</span>
        </button>
      </div>
    </div>
  );
};
