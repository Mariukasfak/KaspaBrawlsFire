
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Brawler, GameState, NarrativeLogEntry, GameItem, NarrativeEvent, BrawlerStats, CombatStatus, WalletState, BattleSummary, BrawlerClass, Skill, StatusEffect, ArenaTier, StatusEffectDefinition } from '../types';
import { DEFAULT_BRAWL_TOKENS, ARENA_TIERS, STATUS_EFFECT_DEFINITIONS } from '../constants';
import { calculateArenaTier } from '../services/brawlerService'; 
import { TrophyIcon } from '../components/Icons';

interface GameContextType extends GameState {
  setBrawler: (brawler: Brawler | null) => void;
  addNarrativeLog: (entry: Omit<NarrativeLogEntry, 'id' | 'timestamp'>) => void;
  clearNarrativeLog: () => void;
  updateBrawlTokens: (amount: number) => void;
  addItemToInventory: (item: GameItem) => void; // Adds to global inventory
  removeItemFromInventory: (itemId: string) => void; // Removes from global inventory
  updateBrawlerItems: (items: GameItem[], targetId: string) => void; // Updates a brawler's in-battle items
  setLoading: (loading: boolean) => void;
  setCurrentEvent: (event: NarrativeEvent | null) => void;
  setBattleState: (active: boolean, opponent?: Brawler | null) => void;
  updateBrawlerStats: (statUpdates: Partial<BrawlerStats>, brawlerId?: string) => void; 
  updateBrawlerHealth: (amount: number, targetId: string) => void;
  updateBrawlerMana: (amount: number, targetId: string) => void;
  updateBrawlerCombatStatus: (updates: Partial<CombatStatus>, targetId: string) => void;
  resetBrawlerCombatStatus: (targetId: string) => void;
  updateOpponent: (opponent: Brawler | null) => void;
  connectWallet: () => void; 
  disconnectWallet: () => void;
  addBattleToHistory: (summary: Omit<BattleSummary, 'id' | 'timestamp'>) => void;
  updateBrawlerSkills: (skills: Skill[], targetId: string) => void;
  updateBrawlerSkillCooldown: (skillId: string, newCooldown: number, targetId: string) => void;
  addStatusEffectToBrawler: (statusEffectKey: string, targetId: string, appliedBySkillId?: string, durationOverride?: number, valueOverride?: number, shieldMaxOverride?: number) => void;
  removeStatusEffectFromBrawler: (effectId: string, targetId: string) => void;
  updateStatusEffectDuration: (effectId: string, newDuration: number, targetId: string) => void;
  setBrawlerStatusEffects: (effects: StatusEffect[], targetId: string) => void;
  incrementTurnNumber: () => void;
  setIsAutoBattling: (isBattling: boolean) => void;
  updateBrawlerArenaPoints: (amount: number, targetId: string) => void;
  updateStatusEffectValue: (effectId: string, newValue: number, targetId: string, newShieldValue?: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBrawler, setCurrentBrawler] = useState<Brawler | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>("KaspaVerse Arena Hub");
  const [narrativeLog, setNarrativeLog] = useState<NarrativeLogEntry[]>([]);
  const [currentEvent, setCurrentEventState] = useState<NarrativeEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [brawlTokens, setBrawlTokens] = useState<number>(DEFAULT_BRAWL_TOKENS);
  const [inventory, setInventory] = useState<GameItem[]>([]); // Player's global inventory
  const [isBattleActive, setIsBattleActive] = useState<boolean>(false);
  const [opponent, setOpponent] = useState<Brawler | null>(null);
  const [battleHistory, setBattleHistory] = useState<BattleSummary[]>([]);
  const [turnNumber, setTurnNumber] = useState<number>(0);
  const [isAutoBattling, setIsAutoBattlingState] = useState<boolean>(false);


  // Wallet State
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [kasAddress, setKasAddress] = useState<string | null>(null);
  const [kasBalance, setKasBalance] = useState<number | null>(null);

  const setBrawler = (brawler: Brawler | null) => setCurrentBrawler(brawler);
  const setLoading = (loading: boolean) => setIsLoading(loading);
  const setCurrentEvent = (event: NarrativeEvent | null) => setCurrentEventState(event);
  const updateOpponent = (updatedOpponent: Brawler | null) => setOpponent(updatedOpponent);
  const incrementTurnNumber = () => setTurnNumber(prev => prev + 1);
  const setIsAutoBattling = (isBattling: boolean) => setIsAutoBattlingState(isBattling);


  const addNarrativeLog = useCallback((entry: Omit<NarrativeLogEntry, 'id' | 'timestamp'>) => {
    setNarrativeLog(prevLog => [...prevLog, { ...entry, id: Date.now().toString() + Math.random().toString(), timestamp: Date.now() }].slice(-100));
  }, []);

  const clearNarrativeLog = useCallback(() => {
    setNarrativeLog([]);
  }, []);

  const updateBrawlTokens = useCallback((amount: number) => {
    setBrawlTokens(prevTokens => Math.max(0, prevTokens + amount));
  }, []);

  const addItemToInventory = useCallback((item: GameItem) => {
    setInventory(prevInventory => {
        const existingItemIndex = prevInventory.findIndex(i => i.id === item.id);
        if (existingItemIndex > -1 && item.quantity !== undefined) {
            const updatedInventory = [...prevInventory];
            updatedInventory[existingItemIndex] = {
                ...updatedInventory[existingItemIndex],
                quantity: (updatedInventory[existingItemIndex].quantity || 0) + (item.quantity || 1)
            };
            return updatedInventory;
        }
        return [...prevInventory, {...item, quantity: item.quantity === undefined ? 1 : item.quantity}];
    });
    addNarrativeLog({ type: 'reward', text: `Acquired item: ${item.name}!` });
  }, [addNarrativeLog]);

  const removeItemFromInventory = useCallback((itemId: string, quantityToRemove: number = 1) => {
    setInventory(prevInventory => {
        const itemIndex = prevInventory.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return prevInventory;

        const item = prevInventory[itemIndex];
        if (item.quantity !== undefined && item.quantity > quantityToRemove) {
            const updatedInventory = [...prevInventory];
            updatedInventory[itemIndex] = { ...item, quantity: item.quantity - quantityToRemove };
            return updatedInventory;
        } else {
            return prevInventory.filter(i => i.id !== itemId);
        }
    });
  }, []);
  
  const updateBrawlerItems = useCallback((items: GameItem[], targetId: string) => {
    const updater = (prev: Brawler | null): Brawler | null => {
        if (!prev || prev.id !== targetId) return prev;
        return { ...prev, items };
    };
    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  }, [currentBrawler, opponent]);


  const setBattleState = useCallback((active: boolean, opponentDetails?: Brawler | null) => {
    setIsBattleActive(active);
    setOpponent(opponentDetails || null);
    setTurnNumber(0); 
    if (active && opponentDetails) {
      addNarrativeLog({ type: 'combat', text: `Battle started against ${opponentDetails.name}!` });
    } else if (!active) {
        setIsAutoBattlingState(false); 
    }
  }, [addNarrativeLog]);

  const addBattleToHistory = useCallback((summary: Omit<BattleSummary, 'id' | 'timestamp'>) => {
    const newSummary = { ...summary, id: crypto.randomUUID(), timestamp: Date.now() };
    setBattleHistory(prevHistory => [newSummary, ...prevHistory].slice(0, 10));
  }, []);


  const updateBrawlerStats = useCallback((statUpdates: Partial<BrawlerStats>, brawlerId?: string) => {
    const updater = (prev: Brawler | null): Brawler | null => {
      if (!prev) return null;
      if (brawlerId && prev.id !== brawlerId) return prev; 
      if (!brawlerId && currentBrawler && prev.id !== currentBrawler.id) return prev;

      const newStats = { ...prev.stats };
      let maxHealthChanged = false;
      let maxManaChanged = false;

      for (const key in statUpdates) {
        const k = key as keyof BrawlerStats;
        if (newStats[k] !== undefined && statUpdates[k] !== undefined) {
          (newStats[k] as number) = (statUpdates[k] as number);
          if (k === 'maxHealth') maxHealthChanged = true;
          if (k === 'maxMana') maxManaChanged = true;
        }
      }
      
      let newCurrentHealth = prev.currentHealth;
      if (maxHealthChanged || newStats.maxHealth < newCurrentHealth) newCurrentHealth = Math.min(newCurrentHealth, newStats.maxHealth);
      
      let newCurrentMana = prev.currentMana;
      if (maxManaChanged || newStats.maxMana < newCurrentMana) newCurrentMana = Math.min(newCurrentMana, newStats.maxMana);

      return { ...prev, stats: newStats, currentHealth: newCurrentHealth, currentMana: newCurrentMana };
    };

    if (brawlerId === opponent?.id) setOpponent(updater);
    else setCurrentBrawler(updater); 
  }, [currentBrawler, opponent]);
  
  const updateBrawlerHealth = useCallback((amount: number, targetId: string) => {
    const updater = (prev: Brawler | null): Brawler | null => {
        if (!prev || prev.id !== targetId) return prev;
        let newHealth = prev.currentHealth + amount;
        newHealth = Math.max(0, Math.min(newHealth, prev.stats.maxHealth));
        return { ...prev, currentHealth: newHealth };
    };
    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  }, [currentBrawler, opponent]);

  const updateBrawlerMana = useCallback((amount: number, targetId: string) => {
    const updater = (prev: Brawler | null): Brawler | null => {
        if (!prev || prev.id !== targetId) return prev;
        let newMana = prev.currentMana + amount;
        newMana = Math.max(0, Math.min(newMana, prev.stats.maxMana));
        return { ...prev, currentMana: newMana };
    };
    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  }, [currentBrawler, opponent]);

  const updateBrawlerCombatStatus = useCallback((updates: Partial<CombatStatus>, targetId: string) => {
    const updater = (prev: Brawler | null): Brawler | null => {
        if (!prev || prev.id !== targetId) return prev;
        return { ...prev, combatStatus: { ...prev.combatStatus, ...updates } };
    };
    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  }, [currentBrawler, opponent]);

  const resetBrawlerCombatStatus = useCallback((targetId: string) => {
    const updater = (prev: Brawler | null): Brawler | null => {
        if (!prev || prev.id !== targetId) return prev;
        return { 
          ...prev, 
          combatStatus: { 
            isDefending: false, 
            isDodging: false, 
            isStunned: false, // Reset stun
            turnsUntilSpecialReady: prev.combatStatus.turnsUntilSpecialReady 
          } 
        };
    };
    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  }, [currentBrawler, opponent]);
  
  const updateBrawlerSkills = useCallback((skills: Skill[], targetId: string) => {
    const updater = (prev: Brawler | null): Brawler | null => {
      if (!prev || prev.id !== targetId) return prev;
      return { ...prev, skills };
    };
    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  }, [currentBrawler, opponent]);

  const updateBrawlerSkillCooldown = useCallback((skillId: string, newCooldown: number, targetId: string) => {
    const updater = (prev: Brawler | null): Brawler | null => {
      if (!prev || prev.id !== targetId) return prev;
      const updatedSkills = prev.skills.map(s => s.id === skillId ? { ...s, currentCooldown: Math.max(0, newCooldown) } : s);
      return { ...prev, skills: updatedSkills };
    };
    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  }, [currentBrawler, opponent]);

  const addStatusEffectToBrawler = useCallback((
    statusEffectKey: string, 
    targetId: string, 
    appliedBySkillId?: string,
    durationOverride?: number, 
    valueOverride?: number,
    shieldMaxOverride?: number
  ) => {
    const definition = STATUS_EFFECT_DEFINITIONS[statusEffectKey];
    if (!definition) {
      console.error(`Status effect definition not found for key: ${statusEffectKey}`);
      return;
    }

    const newEffectInstance: StatusEffect = {
      ...definition,
      id: crypto.randomUUID(),
      key: statusEffectKey,
      appliedBySkillId,
      duration: durationOverride ?? definition.defaultDuration,
      value: valueOverride ?? definition.value,
      appliedTurn: turnNumber,
      shieldDetails: definition.type === 'absorb_shield' 
        ? { currentValue: shieldMaxOverride ?? valueOverride ?? definition.value, maxValue: shieldMaxOverride ?? valueOverride ?? definition.value }
        : undefined,
    };
    
    const updater = (prev: Brawler | null): Brawler | null => {
      if (!prev || prev.id !== targetId) return prev;
      
      const existingEffectIndex = prev.activeStatusEffects.findIndex(se => se.key === statusEffectKey);
      let newStatusEffects;

      if (existingEffectIndex > -1 && newEffectInstance.type !== 'absorb_shield') { // Non-stackable effects refresh
        newStatusEffects = [...prev.activeStatusEffects];
        newStatusEffects[existingEffectIndex] = { 
            ...newStatusEffects[existingEffectIndex], // Keep original ID
            ...newEffectInstance, // Apply new definition properties but retain ID
            id: newStatusEffects[existingEffectIndex].id, // Ensure original ID is kept
            duration: newEffectInstance.duration // Explicitly update duration
        };
         addNarrativeLog({type: "status", text: `${prev.name}'s ${newEffectInstance.name} was refreshed.`, icon: newEffectInstance.icon});
      } else if (existingEffectIndex > -1 && newEffectInstance.type === 'absorb_shield' && newEffectInstance.shieldDetails) { // Shields stack/refresh value
         newStatusEffects = [...prev.activeStatusEffects];
         const existingShield = newStatusEffects[existingEffectIndex];
         const newShieldValue = (existingShield.shieldDetails?.currentValue || 0) + newEffectInstance.shieldDetails.currentValue;
         newStatusEffects[existingEffectIndex] = {
           ...existingShield,
           duration: Math.max(existingShield.duration, newEffectInstance.duration), // Take longer duration
           shieldDetails: {
             currentValue: newShieldValue,
             maxValue: Math.max(existingShield.shieldDetails?.maxValue || 0, newShieldValue), // Update max if new total is higher
           }
         };
         addNarrativeLog({type: "status", text: `${prev.name}'s ${newEffectInstance.name} was reinforced.`, icon: newEffectInstance.icon});
      }
      else { // New effect
        newStatusEffects = [...prev.activeStatusEffects, newEffectInstance];
        addNarrativeLog({type: "status", text: `${prev.name} is affected by ${newEffectInstance.name}!`, icon: newEffectInstance.icon});
      }
      return { ...prev, activeStatusEffects: newStatusEffects };
    };

    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  }, [currentBrawler, opponent, turnNumber, addNarrativeLog]);
  
  const setBrawlerStatusEffects = useCallback((effects: StatusEffect[], targetId: string) => {
     const updater = (prev: Brawler | null): Brawler | null => {
      if (!prev || prev.id !== targetId) return prev;
      return { ...prev, activeStatusEffects: effects };
    };
    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  }, [currentBrawler, opponent]);


  const removeStatusEffectFromBrawler = useCallback((effectId: string, targetId: string) => {
    const updater = (prev: Brawler | null): Brawler | null => {
      if (!prev || prev.id !== targetId) return prev;
      const effectToRemove = prev.activeStatusEffects.find(se => se.id === effectId);
      if (effectToRemove) {
         addNarrativeLog({type: "status", text: `${effectToRemove.name} wore off from ${prev.name}.`, icon: effectToRemove.icon});
      }
      return { ...prev, activeStatusEffects: prev.activeStatusEffects.filter(se => se.id !== effectId) };
    };
    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  }, [currentBrawler, opponent, addNarrativeLog]);

  const updateStatusEffectDuration = useCallback((effectId: string, newDuration: number, targetId: string) => {
    const updater = (prev: Brawler | null): Brawler | null => {
      if (!prev || prev.id !== targetId) return prev;
      const updatedEffects = prev.activeStatusEffects.map(se => se.id === effectId ? { ...se, duration: newDuration } : se);
      return { ...prev, activeStatusEffects: updatedEffects };
    };
    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  },[currentBrawler, opponent]);

  const updateStatusEffectValue = useCallback((effectId: string, newValue: number, targetId: string, newShieldValue?: number) => {
    const updater = (prev: Brawler | null): Brawler | null => {
      if (!prev || prev.id !== targetId) return prev;
      const updatedEffects = prev.activeStatusEffects.map(se => {
        if (se.id === effectId) {
          const updatedEffect = { ...se, value: newValue };
          if (se.type === 'absorb_shield' && se.shieldDetails && newShieldValue !== undefined) {
            updatedEffect.shieldDetails = { ...se.shieldDetails, currentValue: newShieldValue };
          }
          return updatedEffect;
        }
        return se;
      });
      return { ...prev, activeStatusEffects: updatedEffects };
    };
    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
    else if (targetId === opponent?.id) setOpponent(updater);
  }, [currentBrawler, opponent]);


  const updateBrawlerArenaPoints = useCallback((amount: number, targetId: string) => {
    const updater = (prev: Brawler | null): Brawler | null => {
      if (!prev || prev.id !== targetId) return prev;
      const newArenaPoints = Math.max(0, prev.arenaPoints + amount);
      const newArenaTier = calculateArenaTier(newArenaPoints);
      if (newArenaTier !== prev.currentArenaTier) {
        addNarrativeLog({
            type: 'system',
            text: `${prev.name} has reached ${newArenaTier}!`,
            icon: React.createElement(TrophyIcon, { className:"w-4 h-4 text-yellow-400" })
        });
      }
      return { ...prev, arenaPoints: newArenaPoints, currentArenaTier: newArenaTier };
    };

    if (targetId === currentBrawler?.id) setCurrentBrawler(updater);
  }, [currentBrawler, addNarrativeLog]);


  // Wallet Functions (Simulated)
  const connectWallet = useCallback(() => {
    setIsLoading(true);
    addNarrativeLog({type: 'wallet', text: "Attempting to connect to Kasware Wallet..."});
    setTimeout(() => {
      const simulatedAddress = "kaspa:" + Array(55).fill(0).map(() => "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 36))).join('');
      const simulatedBalance = Math.random() * 10000;
      setKasAddress(simulatedAddress);
      setKasBalance(simulatedBalance);
      setIsWalletConnected(true);
      addNarrativeLog({type: 'wallet', text: `Kasware Wallet connected! Address: ${simulatedAddress.substring(0,12)}... Balance: ${simulatedBalance.toFixed(2)} KAS`});
      setIsLoading(false);
    }, 1500);
  }, [addNarrativeLog]);

  const disconnectWallet = useCallback(() => {
    setIsWalletConnected(false);
    setKasAddress(null);
    setKasBalance(null);
    setCurrentBrawler(null); 
    setBattleHistory([]); 
    setTurnNumber(0);
    setIsAutoBattlingState(false);
    addNarrativeLog({type: 'wallet', text: "Kasware Wallet disconnected. Brawler data cleared."});
  }, [addNarrativeLog]);


  return (
    <GameContext.Provider value={{
      currentBrawler, setBrawler,
      currentLocation, 
      narrativeLog, addNarrativeLog, clearNarrativeLog,
      currentEvent, setCurrentEvent,
      isLoading, setLoading,
      brawlTokens, updateBrawlTokens,
      inventory, addItemToInventory, removeItemFromInventory, updateBrawlerItems,
      isBattleActive, opponent, setBattleState,
      updateBrawlerStats,
      updateBrawlerHealth,
      updateBrawlerMana,
      updateBrawlerCombatStatus,
      resetBrawlerCombatStatus,
      updateOpponent,
      isWalletConnected, kasAddress, kasBalance, 
      connectWallet, disconnectWallet, 
      battleHistory, addBattleToHistory,
      updateBrawlerSkills, updateBrawlerSkillCooldown,
      addStatusEffectToBrawler, removeStatusEffectFromBrawler, updateStatusEffectDuration, setBrawlerStatusEffects, updateStatusEffectValue,
      turnNumber, incrementTurnNumber,
      isAutoBattling, setIsAutoBattling,
      updateBrawlerArenaPoints
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
