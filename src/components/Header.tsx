import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>UE5 Player Stats Monitor</h1>
        <p className="subtitle">Real-time statistics from your Unreal Engine 5 game</p>
      </div>
    </header>
  );
};

export default Header;
