import React from 'react';
import Header from './components/Header';
import PlayerStatsDisplay from './components/PlayerStatsDisplay';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <PlayerStatsDisplay />
      </main>
      <Footer />
    </div>
  );
};

export default App;
