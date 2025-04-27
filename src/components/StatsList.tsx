import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import StatItem from './StatItem';

const StatsList: React.FC = () => {
  const playerStats = useSelector((state: RootState) => state.playerStats);

  // Standard stats to display first
  const standardStats = ['health', 'mana', 'stamina', 'position', 'level', 'experience'];

  // Get custom stats (any stats not in the standard list)
  const customStats = Object.keys(playerStats).filter(
    key => !standardStats.includes(key)
  );

  // Check if we have any stats to display
  const hasStandardStats = standardStats.some(key => playerStats[key] !== undefined);
  const hasAnyStats = hasStandardStats || customStats.length > 0;

  if (!hasAnyStats) {
    return (
      <div className="player-stats-empty" id="player-stats">
        <p>Waiting for player statistics...</p>
      </div>
    );
  }

  return (
    <div className="player-stats-value" id="player-stats">
      <div className="stats-category">
        <h4 className="stats-category-title">Basic Stats</h4>
        {/* Standard stats */}
        {standardStats.map(statKey => {
          if (statKey === 'position' && playerStats.position) {
            return (
              <StatItem 
                key={statKey}
                label="Position"
                value={`X: ${playerStats.position.x.toFixed(2)}, Y: ${playerStats.position.y.toFixed(2)}, Z: ${playerStats.position.z.toFixed(2)}`}
              />
            );
          }

          if (playerStats[statKey] !== undefined) {
            return (
              <StatItem 
                key={statKey}
                label={statKey.charAt(0).toUpperCase() + statKey.slice(1)}
                value={playerStats[statKey]}
              />
            );
          }

          return null;
        })}
      </div>

      {/* Custom stats */}
      {customStats.length > 0 && (
        <div className="stats-category">
          <h4 className="stats-category-title">Additional Stats</h4>
          {customStats.map(statKey => (
            <StatItem 
              key={statKey}
              label={statKey.charAt(0).toUpperCase() + statKey.slice(1)}
              value={typeof playerStats[statKey] === 'object' 
                ? JSON.stringify(playerStats[statKey]) 
                : playerStats[statKey]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StatsList;
