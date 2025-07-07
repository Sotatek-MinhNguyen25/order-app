import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Package, Loader2, User, DollarSign, ShoppingCart } from 'lucide-react';
import { useCreateOrder } from '../hooks/useOrders';
import { createOrderSchema, CreateOrderFormData } from '../libs/validation';
import { InputField } from '../components/InputField';

// Mock data cho sản phẩm
const mockProducts = [
  { id: 1, name: 'iPhone 15 Pro Max', price: 32000000 },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 28000000 },
  { id: 3, name: 'MacBook Pro M3', price: 45000000 },
  { id: 4, name: 'iPad Pro 12.9"', price: 25000000 },
  { id: 5, name: 'AirPods Pro Gen 2', price: 6000000 },
  { id: 6, name: 'Apple Watch Series 9', price: 12000000 },
  { id: 7, name: 'Dell XPS 13', price: 35000000 },
  { id: 8, name: 'Sony WH-1000XM5', price: 8000000 },
  { id: 9, name: 'Nintendo Switch OLED', price: 9000000 },
  { id: 10, name: 'PlayStation 5', price: 15000000 },
  { id: 11, name: 'Xbox Series X', price: 14000000 },
  { id: 12, name: 'Google Pixel 8 Pro', price: 20000000 },
  { id: 13, name: 'Surface Pro 9', price: 30000000 },
  { id: 14, name: 'Canon EOS R5', price: 85000000 },
  { id: 15, name: 'Sony A7 IV', price: 65000000 },
  { id: 16, name: 'DJI Mini 4 Pro', price: 18000000 },
  { id: 17, name: 'Logitech MX Master 3S', price: 2500000 },
  { id: 18, name: 'Herman Miller Aeron Chair', price: 35000000 },
  { id: 19, name: 'LG OLED C3 55"', price: 40000000 },
  { id: 20, name: 'Bose QuietComfort 45', price: 7500000 }
];

// Mock UUID cho users
const mockUserIds = [
  '550e8400-e29b-41d4-a716-446655440000',
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  '6ba7b813-9dad-11d1-80b4-00c04fd430c8'
];

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { userId: '', productName: '', amount: 0 },
  });

  const handleProductSelect = (product: typeof mockProducts[0]) => {
    setSelectedProduct(product);
    setValue('productName', product.name);
    setValue('amount', product.price);
  };

  const handleUserIdSelect = (userId: string) => {
    setValue('userId', userId);
  };

  const onSubmit = async (data: CreateOrderFormData) => {
    await createOrderMutation.mutateAsync(data);
    reset();
    navigate('/orders');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold mb-2">Tạo đơn hàng mới</h1>
            <p className="text-emerald-100">Điền thông tin để tạo đơn hàng của bạn</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* User ID Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã người dùng (UUID)
            </label>
            <div className="flex gap-2 mb-2">
              {mockUserIds.map((userId, index) => (
                <button
                  key={userId}
                  type="button"
                  onClick={() => handleUserIdSelect(userId)}
                  className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                >
                  User {index + 1}
                </button>
              ))}
            </div>
            <InputField
              label=""
              icon={<User className="h-4 w-4" />}
              placeholder="550e8400-e29b-41d4-a716-446655440000"
              register={register('userId')}
              error={errors.userId}
              disabled={isSubmitting}
            />
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn sản phẩm
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4 max-h-48 overflow-y-auto border rounded-lg p-3">
              {mockProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductSelect(product)}
                  className={`p-3 text-left rounded-lg border transition-colors ${
                    selectedProduct?.id === product.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </div>
                </button>
              ))}
            </div>
            <InputField
              label="Tên sản phẩm"
              icon={<Package className="h-4 w-4" />}
              placeholder="Nhập tên sản phẩm..."
              register={register('productName')}
              error={errors.productName}
              disabled={isSubmitting}
            />
          </div>

          <InputField
            label="Số tiền (VND)"
            icon={<DollarSign className="h-4 w-4" />}
            type="number"
            min={0}
            step={1000}
            placeholder="0"
            register={register('amount', { valueAsNumber: true })}
            error={errors.amount}
            disabled={isSubmitting}
          />

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Tạo đơn hàng
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Hướng dẫn tạo đơn hàng</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Chọn User ID từ danh sách hoặc nhập UUID hợp lệ</li>
              <li>• Chọn sản phẩm từ danh sách có sẵn hoặc nhập tên sản phẩm</li>
              <li>• Giá sản phẩm sẽ được tự động điền khi chọn từ danh sách</li>
              <li>• Đơn hàng sẽ được xử lý tự động sau khi tạo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
