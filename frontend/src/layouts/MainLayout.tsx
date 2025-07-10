import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Package, LogOut } from 'lucide-react';
import { WebSocketStatus } from '../components';
import { useConnection, useLogout } from '../hooks';

const MainLayout: React.FC = () => {
  useConnection();
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/orders"
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Order Management</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm flex space-x-4">
                <WebSocketStatus />
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
