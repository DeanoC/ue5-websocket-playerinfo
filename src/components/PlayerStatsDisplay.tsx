import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ConnectionStatus from './ConnectionStatus';
import StatsList from './StatsList';

const PlayerStatsDisplay: React.FC = () => {
  const isConnected = useSelector((state: RootState) => state.connection.isConnected);

  return (
    <section className="player-stats">
      <ConnectionStatus />

      <div className="player-stats-info">
        {isConnected ? (
          <>
            <h3 className="player-stats-title">Current Player Stats</h3>
            <StatsList />
          </>
        ) : (
          <div className="no-connection-message">
            <p>No player stats available.</p>
            <p>Connect your UE5 game to receive real-time statistics.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlayerStatsDisplay;
