import React from 'react';
import Header from './components/Header';
import PlayerStatsDisplay from './components/PlayerStatsDisplay';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <h2 className="title">Real-time Player Statistics</h2>
        <PlayerStatsDisplay />
      </main>
      <Footer />
    </>
  );
};

export default App;