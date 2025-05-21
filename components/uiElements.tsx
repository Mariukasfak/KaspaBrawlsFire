
import React from 'react';
import { StatBarProps } from './uiElements.types';

export const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyle = "px-8 py-3 font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 shadow-md hover:shadow-lg";
  let variantStyle = "";

  switch (variant) {
    case 'primary':
      variantStyle = "bg-gradient-to-r from-kaspa-purple to-kaspa-pink text-white hover:from-kaspa-pink hover:to-kaspa-purple focus:ring-kaspa-pink";
      break;
    case 'secondary':
      variantStyle = "bg-kaspa-teal text-kaspa-deep-blue hover:bg-opacity-80 focus:ring-kaspa-teal";
      break;
    case 'outline':
      variantStyle = "bg-transparent border-2 border-kaspa-purple text-kaspa-purple hover:bg-kaspa-purple hover:text-white focus:ring-kaspa-purple";
      break;
  }

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const StatBar: React.FC<StatBarProps> = ({ label, value, maxValue, colorClass = "bg-kaspa-purple" }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-kaspa-light-gray">{label.toUpperCase()}</span>
        <span className="text-sm font-bold text-kaspa-teal">{value}</span>
      </div>
      <div className="w-full bg-kaspa-mid-blue rounded-full h-3 overflow-hidden border border-kaspa-purple/30">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  return (
    <h2 className={`text-4xl font-orbitron font-bold mb-10 text-center text-kaspa-light-gray ${className}`}>
      {children} <span className="text-kaspa-teal">.</span>
    </h2>
  );
};

export const LoadingSpinner: React.FC<{size?: string}> = ({ size = "w-12 h-12" }) => {
    return (
        <div className={`animate-spin rounded-full ${size} border-t-4 border-b-4 border-kaspa-purple`}></div>
    );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="card-bg p-6 rounded-lg shadow-purple-glow w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-orbitron text-kaspa-teal">{title}</h3>
          <button onClick={onClose} className="text-kaspa-gray hover:text-kaspa-light-gray text-2xl">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
