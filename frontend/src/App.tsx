import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import QueryProvider from './providers/QueryProvider';
import MainLayout from './layouts/MainLayout';
import OrdersDashboard from './pages/OrdersDashboard';
import CreateOrder from './pages/CreateOrder';
import OrderDetail from './pages/OrderDetail';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/" element={<MainLayout />}>
            <Route path="orders" element={<OrdersDashboard />} />
            <Route path="orders/create" element={<CreateOrder />} />
            <Route path="orders/:id" element={<OrderDetail />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </QueryProvider>
  );
};

export default App;
