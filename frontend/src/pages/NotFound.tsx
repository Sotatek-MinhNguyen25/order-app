import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-8xl font-bold text-gray-200 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trang không tồn tại</h1>
          <p className="text-gray-600 mb-8">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Home className="h-4 w-4" />
              Về trang chủ
            </Link>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">Có thể bạn đang tìm kiếm:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              to="/orders"
              className="px-3 py-1 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              Danh sách đơn hàng
            </Link>
            <Link
              to="/orders/create"
              className="px-3 py-1 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              Tạo đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
