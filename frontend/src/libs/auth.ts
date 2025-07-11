export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const decodeJWTPayload = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserIdFromToken = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;

  const payload = decodeJWTPayload(token);
  return payload?.userId || payload?.sub || payload?.id || null;
};

export const getUserInfoFromToken = (): { userId: string; email?: string } | null => {
  const token = getAccessToken();
  if (!token) return null;

  const payload = decodeJWTPayload(token);
  if (!payload) return null;

  return {
    userId: payload.userId || payload.sub || payload.id,
    email: payload.email,
  };
};
