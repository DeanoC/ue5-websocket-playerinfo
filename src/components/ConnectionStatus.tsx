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
      {isConnected 
        ? 'Connected to UE5 game' 
        : 'Waiting for UE5 game connection...'}
    </div>
  );
};

export default ConnectionStatus;