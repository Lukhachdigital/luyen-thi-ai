
import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface LoginModalProps {
  onLoginSuccess: () => void;
  onDismiss: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess, onDismiss }) => {
  const handleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged in App.tsx will see the new user.
      // Call onLoginSuccess to immediately close the modal.
      onLoginSuccess();
    } catch (error: any) {
      console.error("Lỗi đăng nhập Google:", error);
      let userMessage = "Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.";

      // Check for specific Firebase Auth error codes for better user guidance
      switch (error.code) {
        case 'auth/operation-not-allowed':
          userMessage = "Lỗi cấu hình: Phương thức đăng nhập Google chưa được bật.\n\nVui lòng vào Firebase Console -> Authentication -> Sign-in method và bật 'Google'.";
          break;
        case 'auth/unauthorized-domain':
          userMessage = `Lỗi cấu hình: Tên miền của ứng dụng chưa được cấp phép.\n\nVui lòng vào Firebase Console -> Authentication -> Sign-in method, và thêm "${window.location.hostname}" vào danh sách 'Authorized domains'.`;
          break;
        default:
          userMessage = `Lỗi đăng nhập.\n\n1. **QUAN TRỌNG NHẤT**: Kiểm tra lại cấu hình trong file 'db/firebase.ts' có chính xác chưa. Đây là nguyên nhân phổ biến nhất.\n2. Đảm bảo tên miền đã được thêm vào 'Authorized domains' trong Firebase Authentication.\n\nMã lỗi: ${error.code}\nChi tiết: ${error.message}`;
          break;
      }
      
      alert(userMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm transform transition-all p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Yêu cầu đăng nhập</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Vui lòng đăng nhập bằng tài khoản Google của bạn để tiếp tục sử dụng các tính năng AI.
        </p>
        <div className="mt-6 mb-4">
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path d="M1 1h22v22H1z" fill="none" /></svg>
            <span>Đăng nhập với Google</span>
          </button>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        >
          Để sau
        </button>
      </div>
    </div>
  );
};
