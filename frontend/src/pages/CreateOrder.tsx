import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Package, Loader2, User, DollarSign, ShoppingCart } from 'lucide-react';
import { useCreateOrder } from '../hooks/useOrders';
import { createOrderSchema, CreateOrderFormData } from '../libs/validation';
import { InputField } from '../components/InputField';

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { userId: '', productName: '', amount: 0 },
  });

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
          <InputField
            label="Mã người dùng (UUID)"
            icon={<User className="h-4 w-4" />}
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            register={register('userId')}
            error={errors.userId}
            disabled={isSubmitting}
          />
          <InputField
            label="Tên sản phẩm"
            icon={<Package className="h-4 w-4" />}
            placeholder="Nhập tên sản phẩm..."
            register={register('productName')}
            error={errors.productName}
            disabled={isSubmitting}
          />
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
              <li>• Mã người dùng phải là UUID hợp lệ</li>
              <li>• Tên sản phẩm không được để trống</li>
              <li>• Số tiền phải lớn hơn hoặc bằng 0</li>
              <li>• Đơn hàng sẽ được xử lý tự động sau khi tạo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
