import { useState, useEffect, useRef, useCallback } from 'react';
import { TOAST_MESSAGES } from '../constants';
import toast from 'react-hot-toast';

export const useConnection = () => {
  const [browserIsOnline, setBrowserIsOnline] = useState(navigator.onLine);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const prevOnline = useRef(browserIsOnline);
  const prevOfflineMode = useRef(isOfflineMode);

  // Listen browser online/offline
  useEffect(() => {
    const updateStatus = () => setBrowserIsOnline(navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  // Reset offlineMode if browser goes offline
  useEffect(() => {
    if (!browserIsOnline) setIsOfflineMode(false);
  }, [browserIsOnline]);

  // Toasts for network and offlineMode changes
  useEffect(() => {
    const onlineChanged = prevOnline.current !== browserIsOnline;
    const offlineModeChanged = prevOfflineMode.current !== isOfflineMode;

    if (onlineChanged) {
      toast[browserIsOnline ? 'success' : 'error'](
        TOAST_MESSAGES.CONNECTION[browserIsOnline ? 'NETWORK_RESTORED' : 'NETWORK_LOST'],
        {
          icon: browserIsOnline ? '🌐' : '📱',
          duration: browserIsOnline ? 1000 : 3000,
        }
      );
      prevOnline.current = browserIsOnline;
    }

    if (offlineModeChanged && browserIsOnline) {
      toast(
        TOAST_MESSAGES.CONNECTION[isOfflineMode ? 'OFFLINE_MODE_ON' : 'OFFLINE_MODE_OFF'],
        {
          icon: isOfflineMode ? '✈️' : '🌐',
          duration: 1000,
        }
      );
      prevOfflineMode.current = isOfflineMode;
    }
  }, [browserIsOnline, isOfflineMode]);

  const toggleOfflineMode = useCallback(() => {
    if (browserIsOnline) setIsOfflineMode(prev => !prev);
  }, [browserIsOnline]);

  return {
    isOnline: browserIsOnline && !isOfflineMode,
    isOfflineMode,
    browserIsOnline,
    toggleOfflineMode
  };
};
