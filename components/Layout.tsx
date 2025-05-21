
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// HACK: Fixed import for ArrowRightOnRectangleIcon
import { MenuIcon, TwitterIcon, DiscordIcon, GithubIcon, WalletIcon, CheckIcon, ArrowRightOnRectangleIcon } from './Icons';
import { useGameContext } from '../context/GameContext'; // Import useGameContext
// import { KasBalanceDisplay } from './KasBalanceDisplay'; // Commented out as functionality is in Header

interface HeaderProps {
  onConnectWalletClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onConnectWalletClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  // HACK: Added currentBrawler to destructuring
  const { isWalletConnected, kasAddress, kasBalance, disconnectWallet, currentBrawler } = useGameContext();

  const formatKasAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsMenuOpen(false);
    navigate('/'); // Navigate to landing after disconnect
  };

  return (
    <header className="bg-kaspa-mid-blue/50 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-kaspa-purple/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to={isWalletConnected && currentBrawler ? "/hub" : "/"} className="text-3xl font-orbitron font-bold text-kaspa-light-gray hover:text-kaspa-purple transition-colors">
            KASPA<span className="text-kaspa-teal">BRAWLERS</span>
          </Link>
          <nav className="hidden md:flex space-x-4 lg:space-x-6 items-center">
            {isWalletConnected && currentBrawler && (
                 <Link to="/hub" className="text-kaspa-light-gray hover:text-kaspa-purple transition-colors px-2 py-1 rounded-md hover:bg-kaspa-purple/10">Hub</Link>
            )}
            {!isWalletConnected && (
                <Link to="/" className="text-kaspa-light-gray hover:text-kaspa-purple transition-colors px-2 py-1 rounded-md hover:bg-kaspa-purple/10">Home</Link>
            )}
            <Link to="/create" className="text-kaspa-light-gray hover:text-kaspa-purple transition-colors px-2 py-1 rounded-md hover:bg-kaspa-purple/10">Create</Link>
            <Link to="/game" className="text-kaspa-light-gray hover:text-kaspa-purple transition-colors px-2 py-1 rounded-md hover:bg-kaspa-purple/10 font-semibold border-b-2 border-kaspa-teal">Arena</Link>
            <button disabled className="text-kaspa-gray cursor-not-allowed px-2 py-1 rounded-md">Story (Soon)</button>
            
            {isWalletConnected && kasAddress && kasBalance !== null ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 p-2 rounded-lg bg-kaspa-deep-blue/50 border border-kaspa-green/70">
                  <CheckIcon className="w-5 h-5 text-kaspa-green" />
                  <div>
                    <p className="text-xs text-kaspa-light-gray font-mono">{formatKasAddress(kasAddress)}</p>
                    <p className="text-xs font-bold text-kaspa-green">{kasBalance.toFixed(2)} KAS</p>
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  title="Disconnect Wallet"
                  className="p-2 text-kaspa-gray hover:text-kaspa-pink transition-colors rounded-md hover:bg-kaspa-pink/10"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onConnectWalletClick}
                className="px-4 py-2 text-sm font-semibold rounded-md text-kaspa-light-gray border border-kaspa-purple hover:bg-kaspa-purple hover:text-kaspa-deep-blue transition-all flex items-center"
              >
                <WalletIcon className="w-5 h-5 mr-2"/> CONNECT WALLET
              </button>
            )}
          </nav>
          <div className="md:hidden flex items-center">
            {isWalletConnected && (
                <button
                  onClick={handleDisconnect}
                  title="Disconnect Wallet"
                  className="p-1 text-kaspa-gray hover:text-kaspa-pink transition-colors rounded-md mr-2"
                >
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                </button>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-kaspa-light-gray hover:text-kaspa-purple">
              <MenuIcon className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-kaspa-mid-blue/95 py-2 absolute w-full shadow-xl">
          {isWalletConnected && currentBrawler ? (
             <Link to="/hub" className="block px-4 py-3 text-kaspa-light-gray hover:bg-kaspa-purple/30" onClick={() => setIsMenuOpen(false)}>Hub</Link>
          ) : (
            <Link to="/" className="block px-4 py-3 text-kaspa-light-gray hover:bg-kaspa-purple/30" onClick={() => setIsMenuOpen(false)}>Home</Link>
          )}
          <Link to="/create" className="block px-4 py-3 text-kaspa-light-gray hover:bg-kaspa-purple/30" onClick={() => setIsMenuOpen(false)}>Create Brawler</Link>
          <Link to="/game" className="block px-4 py-3 text-kaspa-light-gray hover:bg-kaspa-purple/30 font-semibold" onClick={() => setIsMenuOpen(false)}>Arena</Link>
           <button disabled className="block w-full text-left px-4 py-3 text-kaspa-gray cursor-not-allowed">Story (Soon)</button>
          
          {!isWalletConnected && (
            <button 
              onClick={() => { onConnectWalletClick(); setIsMenuOpen(false); }}
              className="w-full text-left px-4 py-3 text-kaspa-light-gray hover:bg-kaspa-purple/30 flex items-center"
            >
              <WalletIcon className="w-5 h-5 mr-2"/> Connect Wallet
            </button>
          )}
           {isWalletConnected && kasAddress && kasBalance !== null && (
              <div className="px-4 py-3 border-t border-kaspa-purple/20">
                <p className="text-xs text-kaspa-light-gray font-mono">{formatKasAddress(kasAddress)}</p>
                <p className="text-sm font-bold text-kaspa-green">{kasBalance.toFixed(2)} KAS</p>
              </div>
            )}
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-kaspa-mid-blue/50 border-t border-kaspa-purple/30 py-12 mt-10">
      <div className="container mx-auto px-4 text-center text-kaspa-gray">
        <div className="mb-6">
          <h3 className="text-2xl font-orbitron text-kaspa-light-gray mb-2">KASPA<span className="text-kaspa-teal">BRAWLERS</span></h3>
          <p className="text-sm">NFT Arena Fighting on the KASPA Blockchain</p>
        </div>
        <div className="flex justify-center space-x-6 mb-6">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-kaspa-purple transition-colors"><DiscordIcon className="w-7 h-7" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-kaspa-purple transition-colors"><TwitterIcon className="w-7 h-7" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-kaspa-purple transition-colors"><GithubIcon className="w-7 h-7" /></a>
        </div>
        <nav className="flex justify-center space-x-4 text-sm mb-6">
          <Link to="/terms" className="hover:text-kaspa-purple">Terms</Link>
          <Link to="/privacy" className="hover:text-kaspa-purple">Privacy</Link>
          <Link to="/faq" className="hover:text-kaspa-purple">FAQ</Link>
        </nav>
        <p className="text-xs">&copy; {new Date().getFullYear()} Kaspa Brawlers. All rights reserved.</p>
      </div>
    </footer>
  );
};
// HACK: Removed extraneous code block and invalid useGameContext call from here.
