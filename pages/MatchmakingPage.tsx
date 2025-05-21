
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { createNewBrawler, calculateArenaTier } from '../services/brawlerService';
import { BrawlerClass, ArenaTier } from '../types'; // Import ArenaTier
import { LoadingSpinner, SectionTitle } from '../components/uiElements';
import { ARENA_TIERS } from '../constants'; // Import ARENA_TIERS
import { CommandLineIcon, TrophyIcon } from '../components/Icons';

const MatchmakingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentBrawler, setBattleState, addNarrativeLog, setLoading: setContextLoading, isLoading } = useGameContext();
  const [status, setStatus] = useState<string>("Initializing Matchmaking Protocols...");
  const [opponentFound, setOpponentFound] = useState<boolean>(false);

  useEffect(() => {
    if (!currentBrawler) {
      navigate('/hub'); // Or /create if that's preferred when no brawler
      return;
    }
    setContextLoading(true);
    setStatus(`Searching for Challenger in ${currentBrawler.currentArenaTier}...`);

    const matchmakingTimer = setTimeout(async () => {
      const randomOpponentClassKey = Object.keys(BrawlerClass)[Math.floor(Math.random() * Object.keys(BrawlerClass).length)] as keyof typeof BrawlerClass;
      const randomOpponentClassValue = BrawlerClass[randomOpponentClassKey];
      const opponentName = `${randomOpponentClassValue.replace(/\s+/g, '')}Bot${Math.floor(Math.random() * 1000)}`;
      
      try {
        let newOpponent = await createNewBrawler(opponentName, randomOpponentClassValue);
        
        // Simulate opponent tier (can be based on player's tier)
        const tierIndexOffset = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const playerTierIndex = ARENA_TIERS.findIndex(t => t.tier === currentBrawler.currentArenaTier);
        const opponentTierIndex = Math.max(0, Math.min(ARENA_TIERS.length - 1, playerTierIndex + tierIndexOffset));
        newOpponent.currentArenaTier = ARENA_TIERS[opponentTierIndex].tier;
        newOpponent.arenaPoints = ARENA_TIERS[opponentTierIndex].minPoints + Math.floor(Math.random() * 100); // Give some points within the tier

        setStatus(`Opponent Found: ${newOpponent.name} (${newOpponent.currentArenaTier})`);
        setOpponentFound(true);
        addNarrativeLog({ type: 'system', text: `Match Found! Preparing to fight ${newOpponent.name} (${newOpponent.currentArenaTier}).` });
        
        // Transition to game page after a short delay to show opponent found
        setTimeout(() => {
          setBattleState(true, newOpponent);
          navigate('/game');
          setContextLoading(false);
        }, 1500);

      } catch (err) {
        console.error("Failed to create opponent for matchmaking:", err);
        setStatus('Error finding opponent. Please try again.');
        addNarrativeLog({type: 'error', text: 'Matchmaking failed. Returning to Hub.'});
        setContextLoading(false);
        setTimeout(() => navigate('/hub'), 2000);
      }
    }, 3000); // Simulate 3 seconds of matchmaking

    return () => {
      clearTimeout(matchmakingTimer);
      setContextLoading(false); // Ensure loading is false if component unmounts
    };
  }, [currentBrawler, navigate, setBattleState, addNarrativeLog, setContextLoading]);

  if (isLoading || !currentBrawler) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <LoadingSpinner size="w-20 h-20" />
        <p className="mt-6 text-2xl font-orbitron text-kaspa-teal animate-pulse">
          {status}
        </p>
      </div>
    );
  }
  
  const playerTierInfo = ARENA_TIERS.find(t => t.tier === currentBrawler.currentArenaTier) || ARENA_TIERS[0];

  return (
    <div className="py-12">
      <SectionTitle>ARENA <span className="text-kaspa-teal">MATCHMAKING</span></SectionTitle>
      <div className="max-w-2xl mx-auto card-bg p-8 md:p-12 rounded-xl shadow-purple-glow text-center">
        <CommandLineIcon className={`w-24 h-24 mx-auto mb-6 ${opponentFound ? 'text-kaspa-green' : 'text-kaspa-purple animate-pulse'}`} />
        <h2 className="text-3xl font-orbitron text-kaspa-light-gray mb-4">
          {opponentFound ? "Opponent Locked!" : "Searching..."}
        </h2>
        <div className="flex items-center justify-center space-x-2 mb-2">
            <TrophyIcon className={`w-5 h-5 ${playerTierInfo.iconColor}`} />
            <p className={`text-lg font-semibold ${playerTierInfo.iconColor}`}>Your Tier: {currentBrawler.currentArenaTier}</p>
        </div>
        <p className="text-kaspa-gray text-lg mb-8 animate-pulse">{status}</p>
        
        {isLoading && !opponentFound && <LoadingSpinner size="w-12 h-12 mx-auto" />}
        
        <button 
            onClick={() => {
                // In a real scenario, this would cancel matchmaking server-side
                addNarrativeLog({type: 'system', text: 'Matchmaking cancelled by user.'});
                navigate('/hub');
            }}
            className="mt-8 px-6 py-2 text-sm font-semibold rounded-md text-kaspa-pink border border-kaspa-pink hover:bg-kaspa-pink hover:text-kaspa-deep-blue transition-all"
        >
            Cancel Search
        </button>
      </div>
    </div>
  );
};

export default MatchmakingPage;
