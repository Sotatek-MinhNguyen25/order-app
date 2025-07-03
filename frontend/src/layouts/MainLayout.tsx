import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Package, Plus, Home, Wifi, WifiOff } from 'lucide-react';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isConnected = true; // TODO: Replace with WebSocket status

  const isActive = (path: string) => {
    if (path === '/orders' && location.pathname === '/orders') return true;
    return location.pathname.startsWith(path) && location.pathname !== '/orders/create';
  };

  const isCreateActive = () => location.pathname === '/orders/create';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-semibold text-gray-900">Order Management</span>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-8">
              <Link
                to="/orders"
                className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/orders')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/orders/create"
                className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isCreateActive()
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Tạo đơn hàng</span>
              </Link>
            </nav>

            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}
              >
                {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
              </span>
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
