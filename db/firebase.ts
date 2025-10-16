
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// QUAN TRỌNG: Chức năng đăng nhập và Firebase đã bị vô hiệu hóa trong phiên bản này.
// Cấu hình dưới đây chỉ là một ví dụ và không hoạt động.
const firebaseConfig = {
  apiKey: "REMOVED-AUTH-DISABLED",
  authDomain: "REMOVED-AUTH-DISABLED",
  projectId: "REMOVED-AUTH-DISABLED",
  storageBucket: "REMOVED-AUTH-DISABLED",
  messagingSenderId: "REMOVED-AUTH-DISABLED",
  appId: "REMOVED-AUTH-DISABLED"
};

// Việc khởi tạo ứng dụng Firebase đã bị vô hiệu hóa.
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

// Xuất các giá trị giả để tránh lỗi import ở các file khác.
// Các chức năng phụ thuộc vào Firebase sẽ không hoạt động.
export const db = null as any;
export const auth = null as any;
