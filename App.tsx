
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateBrawlerPage from './pages/CreateBrawlerPage';
import GamePage from './pages/GamePage';
import HubPage from './pages/HubPage'; // Import HubPage
import MatchmakingPage from './pages/MatchmakingPage'; // Import MatchmakingPage
import { Header, Footer } from './components/Layout';
import { WalletConnectModal } from './components/WalletConnectModal';
import { useGameContext } from './context/GameContext';

const AppContent: React.FC = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { connectWallet, isWalletConnected, currentBrawler } = useGameContext();
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    if (!isWalletConnected) {
      connectWallet(); // This function in context now handles setting connected state and timeout
    }
    // Modal will be closed by its own logic or by WalletConnectModal's onConnect
  };
  
  useEffect(() => {
    if (isWalletConnected && isWalletModalOpen) {
      setIsWalletModalOpen(false); // Close modal once connection is established
      if (currentBrawler) {
        navigate('/hub');
      } else {
        navigate('/create');
      }
    }
  }, [isWalletConnected, currentBrawler, navigate, isWalletModalOpen]);


  return (
    <div className="min-h-screen flex flex-col bg-kaspa-deep-blue font-inter">
      <Header onConnectWalletClick={() => setIsWalletModalOpen(true)} />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-8">
        <Routes>
          <Route path="/" element={isWalletConnected && currentBrawler ? <Navigate to="/hub" /> : <LandingPage />} />
          <Route path="/hub" element={isWalletConnected && currentBrawler ? <HubPage /> : <Navigate to="/" />} />
          <Route path="/create" element={isWalletConnected ? <CreateBrawlerPage /> : <Navigate to="/" />} />
          <Route path="/game" element={isWalletConnected && currentBrawler ? <GamePage /> : <Navigate to="/" />} />
          <Route path="/matchmaking" element={isWalletConnected && currentBrawler ? <MatchmakingPage /> : <Navigate to="/" />} />
          <Route path="/terms" element={<div className="text-center p-10">Terms & Conditions Page - Content Coming Soon</div>} />
          <Route path="/privacy" element={<div className="text-center p-10">Privacy Policy Page - Content Coming Soon</div>} />
          <Route path="/faq" element={<div className="text-center p-10">FAQ Page - Content Coming Soon</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <WalletConnectModal 
        isOpen={isWalletModalOpen && !isWalletConnected} 
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleConnectWallet} // connectWallet from context will set isWalletConnected
      />
    </div>
  );
}


const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
