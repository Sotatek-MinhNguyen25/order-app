import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';
import { useCreateOrder } from '../hooks/useOrders';
import { createOrderSchema, CreateOrderFormData } from '../libs/validation';

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

  const renderField = (
    name: keyof CreateOrderFormData,
    label: string,
    type: string,
    placeholder = ''
  ) => (
    <div>
      <label className="label">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        {...register(name, name === 'amount' ? { valueAsNumber: true } : {})}
        type={type}
        placeholder={placeholder}
        className={`input ${errors[name] ? 'border-red-300 focus:ring-red-500' : ''}`}
        disabled={isSubmitting}
      />
      {errors[name] && <p className="error-text">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-md">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo đơn hàng mới</h1>
          <p className="text-gray-600">Điền thông tin để tạo đơn hàng</p>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderField(
            'userId',
            'Mã người dùng (UUID)',
            'text',
            '550e8400-e29b-41d4-a716-446655440000'
          )}
          {renderField('productName', 'Tên sản phẩm', 'text', 'Nhập tên sản phẩm...')}
          {renderField('amount', 'Số tiền (VND)', 'number')}

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Tạo đơn hàng
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Lưu ý:</h3>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Mã người dùng phải là UUID hợp lệ</li>
          <li>Tên sản phẩm không được để trống</li>
          <li>Số tiền phải lớn hơn hoặc bằng 0</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateOrder;
