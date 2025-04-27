import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ConnectionStatus: React.FC = () => {
  const isConnected = useSelector((state: RootState) => state.connection.isConnected);

  return (
    <div 
      className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}
      id="connection-status"
    >
      <span className="status-indicator"></span>
      <span className="status-text">
        {isConnected 
          ? 'Connected to UE5 game' 
          : 'Waiting for UE5 game connection...'}
      </span>
    </div>
  );
};

export default ConnectionStatus;
