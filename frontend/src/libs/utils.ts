import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

// Status color mapping for Tailwind classes
export const getStatusClasses = (status: string) => {
    const statusClasses = {
        created: 'bg-blue-100 text-blue-800 border-blue-200',
        confirmed: 'bg-orange-100 text-orange-800 border-orange-200',
        processing: 'bg-purple-100 text-purple-800 border-purple-200',
        delivered: 'bg-green-100 text-green-800 border-green-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
        declined: 'bg-red-100 text-red-800 border-red-200',
    };

    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Format currency
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

// Format date
export const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};