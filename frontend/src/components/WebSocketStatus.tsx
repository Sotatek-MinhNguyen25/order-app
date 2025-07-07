import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useConnection } from '../hooks';

const WebSocketStatus: React.FC = () => {
    const { isOnline, browserIsOnline, toggleOfflineMode } = useConnection();

    return (
        <button
            onClick={toggleOfflineMode}
            disabled={!browserIsOnline}
            className={`flex items-center gap-2 text-sm transition-all duration-200 ${browserIsOnline ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-60'
                }`}
            title={browserIsOnline ? 'Click to toggle offline mode' : 'Network unavailable'}
        >
            {isOnline ? (
                <Wifi className="w-4 h-4 text-green-600" />
            ) : (
                <WifiOff className="w-4 h-4 text-gray-500" />
            )}
            <span className={isOnline ? 'text-green-600' : 'text-gray-500'}>
                {isOnline ? 'Online' : 'Offline'}
            </span>
        </button>
    );
};

export default WebSocketStatus;
