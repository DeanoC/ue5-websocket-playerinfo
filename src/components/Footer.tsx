import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="connection-info">
        <h3>Connection Information</h3>
        <p>
          <span className="connection-label">WebSocket URL:</span>
          <code className="connection-url">ws://localhost:8080</code>
        </p>
      </div>
      <div className="footer-note">
        <p>This application monitors player statistics sent from Unreal Engine 5 games.</p>
      </div>
    </footer>
  );
};

export default Footer;
