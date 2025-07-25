import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateOrder } from '../hooks/useOrders';
import { createOrderSchema, CreateOrderFormData } from '../libs/validation';
import { InputField } from '../components/InputField';
import { getUserInfoFromToken } from '../libs/auth';
import { Package, DollarSign, ArrowLeft, ShoppingCart } from 'lucide-react';
const mockProducts = [
  { id: 1, name: 'iPhone 15 Pro Max', price: 32000000 },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 28000000 },
  { id: 3, name: 'MacBook Pro M3', price: 45000000 },
  { id: 4, name: 'iPad Pro 12.9"', price: 25000000 },
  { id: 5, name: 'AirPods Pro Gen 2', price: 6000000 },
];

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();
  const [selectedProduct, setSelectedProduct] = React.useState<(typeof mockProducts)[0] | null>(
    null
  );

  const userInfo = getUserInfoFromToken();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { userId: userInfo?.userId || '', productName: '', amount: 0 },
  });

  const handleProductSelect = (product: (typeof mockProducts)[0]) => {
    setSelectedProduct(product);
    setValue('productName', product.name);
    setValue('amount', product.price);
  };

  const onSubmit = async (data: CreateOrderFormData) => {
    await createOrderMutation.mutateAsync({ ...data, userId: userInfo?.userId || data.userId });
    reset();
    navigate('/orders');
  };

  React.useEffect(() => {
    if (!userInfo?.userId) navigate('/login');
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 py-6 px-2 md:px-6">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-5 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-0.5">
              Tạo đơn hàng mới
            </h1>
            <p className="text-sm text-gray-500">Điền thông tin để tạo đơn hàng của bạn</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {userInfo && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs font-semibold text-gray-700 mb-1">Thông tin người dùng</div>
              <div className="text-sm text-gray-800">
                {/* <div>User ID: {userInfo.userId}</div> */}
                {userInfo.email && <div>Email: {userInfo.email}</div>}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Chọn sản phẩm</label>
            <div className="grid grid-cols-2 gap-1.5 mb-3 max-h-40 overflow-y-auto border rounded-lg p-2 bg-blue-50">
              {mockProducts.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductSelect(product)}
                  className={`p-2 text-left rounded-lg border transition-colors ${selectedProduct?.id === product.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <div className="font-medium text-xs">{product.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      product.price
                    )}
                  </div>
                </button>
              ))}
            </div>
            <InputField
              label="Tên sản phẩm"
              icon={<Package className="h-3.5 w-3.5" />}
              placeholder="Nhập tên sản phẩm..."
              register={register('productName')}
              error={errors.productName}
              disabled={isSubmitting}
            />
          </div>

          <InputField
            label="Số tiền (VND)"
            icon={<DollarSign className="h-3.5 w-3.5" />}
            type="number"
            min={0}
            step={1000}
            placeholder="0"
            register={register('amount', { valueAsNumber: true })}
            error={errors.amount}
            disabled={isSubmitting}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold inline-flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ShoppingCart className="h-3.5 w-3.5 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Tạo đơn hàng
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
