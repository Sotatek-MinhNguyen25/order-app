import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Package, Home } from 'lucide-react';
import { WebSocketStatus } from '../components';
import { useConnection } from '../hooks';

const MainLayout: React.FC = () => {
  const location = useLocation();

  // Enable connection notifications
  useConnection();

  const isActive = (path: string) => {
    if (path === '/orders' && location.pathname === '/orders') return true;
    return location.pathname.startsWith(path) && location.pathname !== '/orders/create';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/orders" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Order Management</span>
            </Link>


            {/* Connection Status */}
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm">
                <WebSocketStatus />
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

