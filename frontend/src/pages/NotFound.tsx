import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 px-2 md:px-8">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-10">
        <div className="text-9xl font-extrabold text-blue-200 mb-4 select-none">404</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Không tìm thấy trang</h1>
        <p className="text-gray-500 mb-6">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => window.history.back()} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold">Quay lại</button>
          <Link to="/orders" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold">Về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
