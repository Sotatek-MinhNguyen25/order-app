import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface InputFieldProps {
    label: string;
    icon: React.ReactNode;
    placeholder?: string;
    type?: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    disabled?: boolean;
    min?: number;
    step?: number;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    icon,
    placeholder,
    type = 'text',
    register,
    error,
    disabled,
    min,
    step,
}) => {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                {icon}
                {label}
                <span className="text-red-500">*</span>
            </label>
            <input
                {...register}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                min={min}
                step={step}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
            />
            {error && (
                <p className="text-red-600 text-xs flex items-center gap-1">
                    {error.message}
                </p>
            )}
        </div>
    );
};
