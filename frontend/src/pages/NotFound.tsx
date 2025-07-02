import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-gray-300">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-900 mt-4">
                        Không tìm thấy trang
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/orders"
                        className="btn-primary w-full"
                    >
                        <Home className="h-4 w-4 mr-2" />
                        Về trang chủ
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="btn-secondary w-full"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;