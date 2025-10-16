
import React from "react";

const mockProfile = {
  email: "student@example.com",
  displayName: "Học sinh",
  class: "9A1",
  role: "student",
  learningProfile: {
    "Môn học": "Toán",
    "Điểm mạnh": "Giải phương trình",
    "Điểm yếu": "Hình học không gian",
    "Gợi ý": "Luyện thêm 5 bài hình học mỗi tuần."
  }
};

export const MyProfile: React.FC = () => {
  return (
    <div className="border dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Hồ sơ của tôi</h2>
      <div className="space-y-2 text-gray-700 dark:text-gray-300">
        <p><strong>Email:</strong> {mockProfile.email}</p>
        <p><strong>Lớp:</strong> {mockProfile.class}</p>
        <p><strong>(Dữ liệu mẫu)</strong></p>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Hồ sơ học tập</h3>
        <pre className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg overflow-auto text-sm">
          {JSON.stringify(mockProfile.learningProfile, null, 2)}
        </pre>
      </div>
    </div>
  );
}
