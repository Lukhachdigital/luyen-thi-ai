import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// QUAN TRỌNG: Vui lòng thay thế cấu hình Firebase của bạn ở đây.
//
// Hướng dẫn từng bước:
// 1. Mở Firebase Console cho dự án của bạn.
// 2. Đi đến mục "Authentication" -> "Sign-in method".
// 3. Bật nhà cung cấp "Google".
// 4. Trong phần "Web SDK configuration", dán "Web client ID" sau vào:
//    320099579191-f331p75bb1ghei0e8hkl1sv63psddhuo.apps.googleusercontent.com
// 5. Quay lại trang Project Settings (Cài đặt dự án) > General (Chung).
// 6. Tìm và sao chép TOÀN BỘ đối tượng `firebaseConfig`.
// 7. Dán toàn bộ đối tượng đó để thay thế cho `firebaseConfig` ở dưới đây.
//
// Việc này là BẮT BUỘC để chức năng đăng nhập hoạt động.
const firebaseConfig = {
  apiKey: "AIzaSy... (Sao chép từ Firebase Console)",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
