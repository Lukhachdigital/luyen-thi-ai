
import React from 'react';

const MOCK_POSTS = [
    { id: 1, author: 'Trần Văn An', avatar: 'https://picsum.photos/200/200?random=1', title: 'Mẹo giải nhanh bài toán hình học không gian?', subject: 'Toán', replies: 12, time: '2 giờ trước' },
    { id: 2, author: 'Lê Thị Bình', avatar: 'https://picsum.photos/200/200?random=2', title: 'Tổng hợp các tác phẩm văn học trọng tâm cần ôn thi', subject: 'Ngữ văn', replies: 25, time: '5 giờ trước' },
    { id: 3, author: 'Nguyễn Hoàng Cường', avatar: 'https://picsum.photos/200/200?random=3', title: 'Làm sao để không bị mất điểm ở những câu dễ trong đề Tiếng Anh?', subject: 'Tiếng Anh', replies: 8, time: '1 ngày trước' },
    { id: 4, author: 'Phạm Minh Dũng', avatar: 'https://picsum.photos/200/200?random=4', title: 'Chia sẻ kinh nghiệm đạt 9+ môn Vật Lý', subject: 'Vật lý', replies: 31, time: '2 ngày trước' },
];

const SubjectTag: React.FC<{ subject: string }> = ({ subject }) => {
    const colorMap: { [key: string]: string } = {
        'Toán': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'Ngữ văn': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'Tiếng Anh': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Vật lý': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    };
    return <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${colorMap[subject] || 'bg-gray-100 text-gray-800'}`}>{subject}</span>;
};


const PostCard: React.FC<typeof MOCK_POSTS[0]> = ({ author, avatar, title, subject, replies, time }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-start space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
        <img src={avatar} alt={author} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{author}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
            </div>
            <h3 className="text-md font-bold my-1 text-gray-900 dark:text-white">{title}</h3>
            <div className="flex items-center justify-between mt-2">
                <SubjectTag subject={subject} />
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {replies} trả lời
                </div>
            </div>
        </div>
    </div>
);

export const Community: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Cộng đồng học tập</h2>
                <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Tạo bài viết mới
                </button>
            </div>

            <div className="space-y-4">
                {MOCK_POSTS.map(post => (
                    <PostCard key={post.id} {...post} />
                ))}
            </div>
        </div>
    );
};
