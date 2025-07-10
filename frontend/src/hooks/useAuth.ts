import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../libs/api';
import { LoginFormData, RegisterFormData } from '../libs/validation';
import { setTokens, clearTokens } from '../libs/auth';
import { QUERY_KEYS, TOAST_MESSAGES } from '../constants';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: response => {
      const { accessToken, refreshToken, user } = response.data;
      setTokens(accessToken, refreshToken);
      queryClient.setQueryData(QUERY_KEYS.AUTH.USER, user);
      toast.success(TOAST_MESSAGES.AUTH.LOGIN_SUCCESS);
      navigate('/orders');
    },
    onError: () => {
      toast.error(TOAST_MESSAGES.AUTH.LOGIN_ERROR);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterFormData) => authApi.register(data),
    onSuccess: response => {
      const { accessToken, refreshToken, user } = response.data;
      setTokens(accessToken, refreshToken);
      queryClient.setQueryData(QUERY_KEYS.AUTH.USER, user);
      toast.success(TOAST_MESSAGES.AUTH.REGISTER_SUCCESS);
      navigate('/orders');
    },
    onError: () => {
      toast.error(TOAST_MESSAGES.AUTH.REGISTER_ERROR);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    clearTokens();
    queryClient.removeQueries({ queryKey: QUERY_KEYS.AUTH.USER });
    toast.success(TOAST_MESSAGES.AUTH.LOGOUT_SUCCESS);
    navigate('/login');
  };
};
