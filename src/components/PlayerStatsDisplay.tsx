import React from 'react';
import ConnectionStatus from './ConnectionStatus';
import StatsList from './StatsList';

const PlayerStatsDisplay: React.FC = () => {
  return (
    <section className="player-stats">
      <div className="player-stats-info">
        <p className="player-stats-text">Current Player Stats:</p>
        <StatsList />
      </div>
      <ConnectionStatus />
    </section>
  );
};

export default PlayerStatsDisplay;