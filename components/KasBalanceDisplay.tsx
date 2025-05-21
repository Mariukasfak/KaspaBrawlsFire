import React from 'react';
import { useGameContext } from '../context/GameContext';
import { WalletIcon } from './Icons'; // Or a KAS specific icon

// This component is currently integrated into Header.tsx for simplicity.
// It can be extracted if more complex display logic for KAS balance is needed.

interface KasBalanceDisplayProps {
  className?: string;
}

export const KasBalanceDisplay: React.FC<KasBalanceDisplayProps> = ({ className }) => {
  const { isWalletConnected, kasAddress, kasBalance } = useGameContext();

  if (!isWalletConnected || kasAddress === null || kasBalance === null) {
    return null; // Or a prompt to connect wallet
  }

  const formatKasAddress = (address: string) => {
    return `${address.substring(0, 10)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div className={`p-3 rounded-lg bg-kaspa-mid-blue/70 border border-kaspa-teal/50 shadow-teal-glow ${className}`}>
      <div className="flex items-center mb-1">
        <WalletIcon className="w-5 h-5 text-kaspa-teal mr-2" />
        <span className="text-sm font-semibold text-kaspa-teal">KAS Wallet</span>
      </div>
      <p className="text-xs text-kaspa-light-gray font-mono" title={kasAddress}>
        {formatKasAddress(kasAddress)}
      </p>
      <p className="text-lg font-bold text-white">
        {kasBalance.toFixed(4)} <span className="text-sm text-kaspa-teal">KAS</span>
      </p>
    </div>
  );
};
