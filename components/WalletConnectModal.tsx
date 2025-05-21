import React from 'react';
import { Modal, ActionButton } from './uiElements';
import { WalletIcon } from './Icons'; // Assuming you have a WalletIcon

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Kasware Wallet">
      <div className="text-center">
        <WalletIcon className="w-24 h-24 text-kaspa-purple mx-auto mb-6" />
        <p className="text-kaspa-light-gray mb-2">
          Connect your Kasware wallet to mint Brawlers, participate in battles, and manage your KAS tokens.
        </p>
        <p className="text-xs text-kaspa-gray mb-8">
          This is a simulation. No real wallet connection will be established.
        </p>
        <ActionButton onClick={onConnect} variant="primary" className="w-full mb-3">
          Connect to Kasware (Simulated)
        </ActionButton>
        <ActionButton onClick={onClose} variant="outline" className="w-full">
          Cancel
        </ActionButton>
      </div>
    </Modal>
  );
};