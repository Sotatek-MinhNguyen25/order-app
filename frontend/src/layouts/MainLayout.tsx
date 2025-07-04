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
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Order Management</span>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-2">
              <Link
                to="/orders"
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/orders')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/orders/create"
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isCreateActive()
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <Plus className="h-4 w-4" />
                <span>Tạo đơn hàng</span>
              </Link>
            </nav>

            {/* Connection Status */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  {isConnected ? (
                    <Wifi className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-600" />
                  )}
                  <div
                    className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                      }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${isConnected ? 'text-emerald-600' : 'text-red-600'
                    }`}
                >
                  {isConnected ? 'Online' : 'Offline'}
                </span>
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

