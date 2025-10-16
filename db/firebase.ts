import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// QUAN TRỌNG: Vui lòng thay thế cấu hình Firebase của bạn ở đây.
// Bạn có thể lấy toàn bộ đối tượng cấu hình này từ Firebase Console
// trong phần Project Settings (Cài đặt dự án) > General (Chung).
//
// Google Client ID bạn cung cấp (320099579191-...apps.googleusercontent.com)
// được dùng để cấu hình phương thức đăng nhập Google trong mục Authentication,
// không phải để dán trực tiếp vào đây.
//
// Hãy sao chép toàn bộ đối tượng `firebaseConfig` từ dự án của bạn và dán vào đây để ứng dụng hoạt động.
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