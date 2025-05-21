
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { Brawler, NarrativeChoice, NarrativeEvent, GameItem, BrawlerStats, ActionResult, CombatActionType, CombatStatus, CombatEffect, BattleSummary, BrawlerClass, ArenaTier, Skill, StatusEffect } from '../types';
import { ActionButton, LoadingSpinner, StatBar, Modal } from '../components/uiElements';
import { BattleBrawlerCard } from '../components/BattleBrawlerCard';
import { generateNarrativeEventDescription, generateChoicesForEvent, generateCombatActionText } from '../services/geminiService';
import { createNewBrawler, gainXp, calculateArenaTier } from '../services/brawlerService'; 
import { BRAWLER_CLASSES, INITIAL_LOCATIONS, STAT_DESCRIPTIONS, POINTS_PER_WIN, POINTS_PER_LOSS, ARENA_TIERS, STATUS_EFFECT_DEFINITIONS } from '../constants';
import { 
    HeartIcon, ShieldIcon, BoltIcon, SunIcon, EyeIcon, PuzzlePieceIcon, BeakerIcon, 
    CurrencyDollarIcon, BackpackIcon, CommandLineIcon, ArrowPathIcon, UserCircleIcon, 
    SparklesIcon, ShieldExclamationIcon, SwordIcon, WindIcon, MagicBlastIcon, DaggerIcon, FistIcon,
    CheckIcon, XMarkIcon, TrophyIcon, WalletIcon, FireIcon, StopIcon
} from '../components/Icons';


const StatDisplayItem: React.FC<{icon: React.ReactNode, label: keyof BrawlerStats | string, value: number, maxValue?: number, description?: string}> = ({icon, label, value, maxValue, description}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const displayValue = maxValue ? `${value}/${maxValue}` : `${value}`;
  const labelStr = label.toString();

  return (
    <div 
      className="relative flex items-center space-x-2 p-2 bg-kaspa-deep-blue/30 rounded hover:bg-kaspa-deep-blue/50 cursor-default"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="text-kaspa-teal">{icon}</span>
      <span className="text-xs font-semibold text-kaspa-light-gray uppercase">{labelStr.substring(0,3)}:</span>
      <span className="text-xs text-white font-bold">{displayValue}</span>
      {description && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-kaspa-mid-blue text-white text-xs rounded shadow-lg z-20 border border-kaspa-purple">
          <strong className="capitalize">{labelStr}:</strong> {description}
        </div>
      )}
    </div>
  );
};

interface PostBattleSummaryExtended extends BattleSummary {
    arenaPointsChange?: number;
}

const AUTO_BATTLE_DELAY = 1800; // ms between auto-battle actions

// Helper to apply stat modifications from status effects
const applyStatModification = (baseValue: number, effect: StatusEffect): number => {
    if (effect.valueType === 'flat') {
        return baseValue + effect.value;
    } else if (effect.valueType === 'percentage') {
        return baseValue * (1 + effect.value / 100);
    }
    return baseValue;
};

// Helper to calculate damage considering all factors
const calculateDamage = (
    baseDamage: number, 
    attacker: Brawler, 
    defender: Brawler, 
    isCritical: boolean
): { finalDamage: number, damageDetails: string, criticalBonus: number } => {
    let currentDamage = baseDamage;
    let details = "";
    let criticalDamageBonus = 0;

    // Attacker buffs (e.g., Strength buff)
    attacker.activeStatusEffects.forEach(effect => {
        if (effect.type === 'stat_buff' && (effect.statAffected === 'strength' || effect.statAffected === 'intelligence')) {
            // Assuming baseDamage already incorporates the primary stat, so this could be a multiplier for specific skills
            // For simplicity, let's say some buffs grant a flat bonus or percentage increase to outgoing damage
            if (effect.valueType === 'percentage') currentDamage *= (1 + effect.value / 100);
            else currentDamage += effect.value; // Flat damage bonus from buff
            details += `(${effect.name}) `;
        }
    });
    
    if (isCritical) {
        const critMultiplier = 1.75;
        criticalDamageBonus = Math.floor(currentDamage * (critMultiplier - 1));
        currentDamage = Math.floor(currentDamage * critMultiplier);
        details += "CRITICAL HIT! ";
    }

    // Defender's armor and damage reduction effects
    let effectiveArmor = defender.stats.armor;
    defender.activeStatusEffects.forEach(effect => {
        if (effect.type === 'stat_debuff' && effect.statAffected === 'armor') {
            effectiveArmor = applyStatModification(effectiveArmor, {...effect, value: -effect.value}); // invert value for debuff
        }
    });
    effectiveArmor = Math.max(0, effectiveArmor); // Armor can't be negative

    const armorReduction = effectiveArmor * 0.5; // Each point of armor reduces damage by 0.5 (example)
    currentDamage = Math.max(1, Math.floor(currentDamage - armorReduction));

    defender.activeStatusEffects.forEach(effect => {
        if (effect.type === 'damage_reduction') {
            if (effect.valueType === 'percentage') {
                currentDamage = Math.floor(currentDamage * (1 - effect.value / 100));
            } else {
                currentDamage = Math.max(1, currentDamage - effect.value);
            }
            details += `(${effect.name}) `;
        }
    });
    
    if (defender.combatStatus.isDefending) {
        currentDamage = Math.max(1, Math.floor(currentDamage * 0.5)); 
        details += "(Defended) ";
    }
    
    currentDamage = Math.max(1, currentDamage); // Ensure at least 1 damage if hit and not fully absorbed

    // FIX: Changed 'criticalBonus' to 'criticalBonus: criticalDamageBonus' to correctly use the calculated variable.
    return { finalDamage: currentDamage, damageDetails: details.trim(), criticalBonus: criticalDamageBonus };
};


const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const gameContext = useGameContext();
  const {
    currentBrawler, setCurrentEvent: setGlobalCurrentEvent, opponent: globalOpponentFromContext, setBrawler,
    narrativeLog, addNarrativeLog, isLoading: contextIsLoading, setLoading, currentEvent: globalCurrentEvent, 
    brawlTokens, updateBrawlTokens, inventory, addItemToInventory, 
    isBattleActive, setBattleState, updateOpponent,
    updateBrawlerStats, updateBrawlerHealth, updateBrawlerMana,
    updateBrawlerCombatStatus, resetBrawlerCombatStatus,
    isWalletConnected, kasAddress, kasBalance, addBattleToHistory,
    turnNumber, incrementTurnNumber, isAutoBattling, setIsAutoBattling,
    updateBrawlerArenaPoints, updateBrawlerSkillCooldown, addStatusEffectToBrawler,
    removeStatusEffectFromBrawler, updateStatusEffectDuration, updateStatusEffectValue
  } = gameContext;

  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [activeCombatVisualEffect, setActiveCombatVisualEffect] = useState<CombatEffect | null>(null);
  const [postBattleSummary, setPostBattleSummary] = useState<PostBattleSummaryExtended | null>(null);
  const [currentAttackerId, setCurrentAttackerId] = useState<string | null>(null);
  
  const opponent = globalOpponentFromContext; // Direct use, context should be source of truth

  // FIX: Defined fetchNarrativeEvent to handle generation and setting of narrative events.
  const fetchNarrativeEvent = useCallback(async (brawler: Brawler) => {
    if (!brawler) return;
    setLoading(true);
    addNarrativeLog({ type: 'system', text: `Searching for a new encounter in ${brawler.currentLocation || 'the unknown'}...`, icon: <PuzzlePieceIcon className="w-4 h-4"/> });
    try {
      const description = await generateNarrativeEventDescription(brawler.name, brawler.brawlerClass, brawler.currentLocation || 'a mysterious place');
      const choicesTexts = await generateChoicesForEvent(description, brawler.brawlerClass, brawler.stats);
      
      const newEvent: NarrativeEvent = {
        id: crypto.randomUUID(),
        title: `Encounter in ${brawler.currentLocation || 'the unknown'}`,
        description: description,
        choices: choicesTexts.map(text => ({ text, actionKey: text.toLowerCase().replace(/\s+/g, '_').substring(0, 30) })), // Basic actionKey
      };
      setGlobalCurrentEvent(newEvent);
      addNarrativeLog({ type: 'narrative', text: description, icon: <PuzzlePieceIcon className="w-4 h-4" /> });
    } catch (error) {
      console.error("Error fetching narrative event:", error);
      addNarrativeLog({ type: 'error', text: "Failed to generate a new encounter. The path ahead is murky." });
      // Provide a fallback event
      setGlobalCurrentEvent({
        id: crypto.randomUUID(),
        title: "A Moment of Respite",
        description: "The digital winds calm for a moment. You take a breath and survey your surroundings, the path unclear.",
        choices: [{ text: "Scan for anomalies", actionKey: "scan_anomalies" }, { text: "Conserve energy", actionKey: "conserve_energy"}],
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading, addNarrativeLog, setGlobalCurrentEvent]);

  useEffect(() => {
    if (!currentBrawler) {
      navigate('/create'); return; 
    }
    if (isBattleActive && opponent && !currentAttackerId && !postBattleSummary) {
        const playerGoesFirst = currentBrawler.stats.agility + Math.random() * 10 > opponent.stats.agility + Math.random() * 10;
        const initialAttacker = playerGoesFirst ? currentBrawler.id : opponent.id;
        setCurrentAttackerId(initialAttacker);
        if (turnNumber === 0) incrementTurnNumber(); 
        addNarrativeLog({type: 'system', text: `${playerGoesFirst ? currentBrawler.name : opponent.name} takes initiative! Turn ${turnNumber === 0 ? 1 : turnNumber}`});
        setIsAutoBattling(true); 
    }
  }, [currentBrawler, navigate, isBattleActive, opponent, currentAttackerId, postBattleSummary, addNarrativeLog, turnNumber, incrementTurnNumber, setIsAutoBattling]);

  // FIX: Added useEffect to fetch initial narrative event if not in battle and no event exists
  useEffect(() => {
    if (!currentBrawler) {
      return; // Should be redirected by other logic if brawler is null
    }
    // Only fetch if not in battle, no current event, not loading, no post-battle summary, and brawler exists
    if (!isBattleActive && !globalCurrentEvent && !contextIsLoading && !postBattleSummary && currentBrawler) {
      fetchNarrativeEvent(currentBrawler);
    }
  }, [currentBrawler, isBattleActive, globalCurrentEvent, contextIsLoading, postBattleSummary, fetchNarrativeEvent]);


  const displayCombatVisualEffect = (type: CombatEffect['type'], value: string | number, targetBrawlerId: string, icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>, isCritical: boolean = false) => {
    const effect: CombatEffect = { 
      id: crypto.randomUUID(), type, value: value.toString(), targetId: targetBrawlerId, 
      icon, duration: isCritical ? 1800 : 1200, isCritical 
    };
    setActiveCombatVisualEffect(effect);
    setTimeout(() => setActiveCombatVisualEffect(null), effect.duration);
  };
  

  const simulateAutoBattleRound = useCallback(async () => {
    if (!currentBrawler || !opponent || !isBattleActive || !currentAttackerId || postBattleSummary || contextIsLoading) {
        if (!postBattleSummary && !contextIsLoading) setIsAutoBattling(false);
        return;
    }
    setLoading(true); 

    let attacker = currentAttackerId === currentBrawler.id ? gameContext.currentBrawler : gameContext.opponent;
    let defender = currentAttackerId === currentBrawler.id ? gameContext.opponent : gameContext.currentBrawler;

    if (!attacker || !defender) {
        setBattleState(false, null); setIsAutoBattling(false); setLoading(false); return;
    }

    // --- Start of Turn Phase ---
    addNarrativeLog({type: 'system', text: `--- ${attacker.name}'s Turn (${turnNumber}) ---`});

    // Process Attacker's Status Effects (DoTs, HoTs, Stuns, Cooldowns, Durations)
    let canAttackerAct = true;
    const attackerEffectsCopy = [...attacker.activeStatusEffects]; // Iterate over a copy
    for (const effect of attackerEffectsCopy) {
        let effectExpired = false;
        if (effect.type === 'damage_over_time') {
            updateBrawlerHealth(-effect.value, attacker.id);
            addNarrativeLog({type: 'status', text: `${attacker.name} takes ${effect.value} damage from ${effect.name}.`, icon: effect.icon});
            displayCombatVisualEffect('damage', effect.value, attacker.id, effect.icon);
        } else if (effect.type === 'heal_over_time') {
            updateBrawlerHealth(effect.value, attacker.id);
            addNarrativeLog({type: 'status', text: `${attacker.name} recovers ${effect.value} HP from ${effect.name}.`, icon: effect.icon});
            displayCombatVisualEffect('heal', effect.value, attacker.id, effect.icon);
        } else if (effect.type === 'mana_regen') {
            updateBrawlerMana(effect.value, attacker.id);
            addNarrativeLog({type: 'status', text: `${attacker.name} recovers ${effect.value} MP from ${effect.name}.`, icon: effect.icon});
        } else if (effect.type === 'stun' && (attacker.combatStatus.isStunned || effect.duration > 0)) {
            canAttackerAct = false;
            addNarrativeLog({type: 'status', text: `${attacker.name} is stunned and cannot act!`, icon: <StopIcon className="w-4 h-4 text-yellow-400"/>});
            displayCombatVisualEffect('text_indicator', 'STUNNED', attacker.id, <StopIcon className="w-8 h-8 text-yellow-500"/>);
        }
        
        const newDuration = effect.duration - 1;
        if (newDuration <= 0) {
            removeStatusEffectFromBrawler(effect.id, attacker.id);
            effectExpired = true;
        } else {
            updateStatusEffectDuration(effect.id, newDuration, attacker.id);
        }
    }
    // Update attacker combat status if stun wore off
    if (attacker.combatStatus.isStunned && !attacker.activeStatusEffects.some(e => e.type === 'stun' && e.duration > 0)) {
        updateBrawlerCombatStatus({ isStunned: false }, attacker.id);
    }
    
    // Decrement skill cooldowns for attacker
    attacker.skills.forEach(skill => {
        if (skill.currentCooldown > 0) {
            updateBrawlerSkillCooldown(skill.id, skill.currentCooldown - 1, attacker.id);
        }
    });
    // Refresh attacker/defender state after status processing
    attacker = currentAttackerId === currentBrawler.id ? gameContext.currentBrawler! : gameContext.opponent!;
    defender = currentAttackerId === currentBrawler.id ? gameContext.opponent! : gameContext.currentBrawler!;


    // --- Action Phase ---
    let actionText = "";
    let attackOutcomeIcon = <SwordIcon className="w-4 h-4 text-gray-400"/>;
    let visualEffectIcon : React.ReactElement | undefined = undefined;
    let visualEffectType: CombatEffect['type'] = 'text_indicator';
    let visualEffectValue: string | number = "MISS!";

    if (canAttackerAct) {
        // AI Action Selection (simple version)
        const usableSkills = attacker.skills.filter(s => s.currentCooldown === 0 && attacker.currentMana >= s.manaCost);
        let chosenAction: 'attack' | Skill = 'attack';

        if (usableSkills.length > 0) {
            // Basic Heuristic: Heal if HP < 40% and has a heal skill
            const healSkill = usableSkills.find(s => s.effectType === 'heal' && s.target === 'self');
            if (healSkill && attacker.currentHealth < attacker.stats.maxHealth * 0.4) {
                chosenAction = healSkill;
            } else {
                 // Prioritize offensive skills if enemy is low, or use buffs/debuffs
                const offensiveSkill = usableSkills.find(s => (s.effectType === 'damage' || s.effectType === 'special_attack' || s.effectType === 'debuff_target') && s.target === 'enemy');
                const selfBuffSkill = usableSkills.find(s => (s.effectType === 'buff_self' || s.effectType === 'shield_self') && s.target === 'self');

                if (defender.currentHealth < defender.stats.maxHealth * 0.3 && offensiveSkill) chosenAction = offensiveSkill;
                else if (selfBuffSkill && Math.random() < 0.4 && !attacker.activeStatusEffects.some(se => se.key === selfBuffSkill.appliesStatusEffectKey)) chosenAction = selfBuffSkill; // Less likely to spam buffs
                else if (offensiveSkill && Math.random() < 0.6) chosenAction = offensiveSkill; // More likely to attack
                else if (usableSkills.length > 0 && Math.random() < 0.5) chosenAction = usableSkills[Math.floor(Math.random() * usableSkills.length)]; // Fallback to random usable skill
            }
        }

        if (chosenAction !== 'attack') { // Skill Use
            const skill = chosenAction as Skill;
            updateBrawlerMana(-skill.manaCost, attacker.id);
            updateBrawlerSkillCooldown(skill.id, skill.cooldown, attacker.id);
            actionText = `${attacker.name} uses ${skill.name}!`;
            attackOutcomeIcon = React.cloneElement(skill.icon || <SparklesIcon/>, {className: "w-4 h-4"});
            visualEffectIcon = React.cloneElement(skill.icon || <SparklesIcon/>, {className: "w-8 h-8"});

            switch (skill.effectType) {
                case 'damage':
                case 'special_attack':
                    const baseSkillDamage = skill.effectValue || attacker.stats.strength; // Default to STR if no effectValue
                    const hitRoll = Math.random() * 100;
                    const accuracyRating = attacker.stats.accuracy * 1.5 + attacker.stats.luck * 0.5;
                    const evasionRating = defender.combatStatus.isDodging ? defender.stats.agility * 1.2 : defender.stats.agility;
                    const hitChance = Math.max(10, Math.min(95, 75 + accuracyRating - evasionRating));

                    if (hitRoll < hitChance) {
                        if (defender.combatStatus.isDodging) {
                            actionText += ` But ${defender.name} dodges!`;
                            visualEffectType = 'text_indicator'; visualEffectValue = 'DODGED!';
                            updateBrawlerCombatStatus({ isDodging: false }, defender.id);
                        } else {
                            const isCritical = Math.random() * 100 < (5 + attacker.stats.luck * 1.5 + (skill.effectType === 'special_attack' ? 10 : 0)); // Special attacks more likely to crit
                            const { finalDamage, damageDetails } = calculateDamage(baseSkillDamage, attacker, defender, isCritical);
                            
                            let actualDamageDealt = finalDamage;
                            // Shield absorption
                            const shieldEffect = defender.activeStatusEffects.find(e => e.type === 'absorb_shield' && e.shieldDetails && e.shieldDetails.currentValue > 0);
                            if (shieldEffect && shieldEffect.shieldDetails) {
                                const damageToShield = Math.min(shieldEffect.shieldDetails.currentValue, actualDamageDealt);
                                const newShieldValue = shieldEffect.shieldDetails.currentValue - damageToShield;
                                actualDamageDealt -= damageToShield;
                                updateStatusEffectValue(shieldEffect.id, shieldEffect.value, defender.id, newShieldValue);
                                actionText += ` ${defender.name}'s shield absorbs ${damageToShield} damage!`;
                                if (newShieldValue <= 0) removeStatusEffectFromBrawler(shieldEffect.id, defender.id);
                            }

                            if(actualDamageDealt > 0) updateBrawlerHealth(-actualDamageDealt, defender.id);
                            actionText += ` ${defender.name} takes ${actualDamageDealt} damage. ${damageDetails}`;
                            visualEffectType = isCritical ? 'critical_indicator' : 'damage';
                            visualEffectValue = actualDamageDealt;
                        }
                    } else {
                        actionText += ` But it misses ${defender.name}.`;
                        visualEffectType = 'text_indicator'; visualEffectValue = 'MISS!';
                    }
                    break;
                case 'heal':
                    const healAmount = skill.effectValue || Math.floor(attacker.stats.intelligence * 1.5);
                    updateBrawlerHealth(healAmount, attacker.id); // Assuming heal skills are self-target for now
                    actionText += ` ${attacker.name} recovers ${healAmount} HP.`;
                    visualEffectType = 'heal'; visualEffectValue = healAmount;
                    break;
                case 'buff_self':
                case 'shield_self':
                case 'buff_target': // Assuming buff_target for now affects self for simplicity in auto-battle
                case 'debuff_target':
                     const targetForStatus = (skill.target === 'enemy' ? defender.id : attacker.id);
                     if (skill.appliesStatusEffectKey) {
                        addStatusEffectToBrawler(skill.appliesStatusEffectKey, targetForStatus, skill.id, skill.statusEffectDuration, skill.statusEffectValue, skill.effectType === 'shield_self' ? skill.effectValue : undefined);
                        actionText += ` ${STATUS_EFFECT_DEFINITIONS[skill.appliesStatusEffectKey].description}`;
                     } else {
                        actionText += ` A strange energy surrounds ${targetForStatus === attacker.id ? attacker.name : defender.name}.`;
                     }
                     visualEffectType = 'status'; visualEffectValue = skill.name;
                    break;
            }
            addNarrativeLog({ type: 'skill', text: actionText, icon: attackOutcomeIcon });
            if(visualEffectIcon) displayCombatVisualEffect(visualEffectType, visualEffectValue, skill.target === 'enemy' ? defender.id : attacker.id, visualEffectIcon, visualEffectType === 'critical_indicator');

        } else { // Basic Attack
            const baseDamage = attacker.stats.strength * 0.8 + attacker.stats.agility * 0.2; // Example basic attack scaling
            const hitRoll = Math.random() * 100;
            const accuracyRating = attacker.stats.accuracy + attacker.stats.luck * 0.5;
            const evasionRating = defender.combatStatus.isDodging ? defender.stats.agility * 1.2 : defender.stats.agility;
            const hitChance = Math.max(10, Math.min(95, 75 + accuracyRating - evasionRating));
            attackOutcomeIcon = <SwordIcon className={`w-4 h-4 ${attacker.id === currentBrawler.id ? "text-kaspa-green" : "text-kaspa-red"}`}/>;
            visualEffectIcon = <SwordIcon className={`w-8 h-8 ${attacker.id === currentBrawler.id ? "text-kaspa-green" : "text-kaspa-red"}`}/>;

            if (hitRoll < hitChance) {
                 if (defender.combatStatus.isDodging) {
                    actionText = `${attacker.name} attacks, but ${defender.name} dodges!`;
                    visualEffectType = 'text_indicator'; visualEffectValue = 'DODGED!';
                    updateBrawlerCombatStatus({ isDodging: false }, defender.id);
                } else {
                    const isCritical = Math.random() * 100 < (5 + attacker.stats.luck);
                    const { finalDamage, damageDetails } = calculateDamage(baseDamage, attacker, defender, isCritical);
                    
                    let actualDamageDealt = finalDamage;
                    const shieldEffect = defender.activeStatusEffects.find(e => e.type === 'absorb_shield' && e.shieldDetails && e.shieldDetails.currentValue > 0);
                    if (shieldEffect && shieldEffect.shieldDetails) {
                        const damageToShield = Math.min(shieldEffect.shieldDetails.currentValue, actualDamageDealt);
                        const newShieldValue = shieldEffect.shieldDetails.currentValue - damageToShield;
                        actualDamageDealt -= damageToShield;
                        updateStatusEffectValue(shieldEffect.id, shieldEffect.value, defender.id, newShieldValue);
                        actionText += `${defender.name}'s shield absorbs ${damageToShield} damage! `;
                         if (newShieldValue <= 0) removeStatusEffectFromBrawler(shieldEffect.id, defender.id);
                    }

                    if(actualDamageDealt > 0) updateBrawlerHealth(-actualDamageDealt, defender.id);
                    actionText += `${attacker.name} ${isCritical ? 'critically ' : ''}hits ${defender.name} for ${actualDamageDealt} damage. ${damageDetails}`;
                    visualEffectType = isCritical ? 'critical_indicator' : 'damage';
                    visualEffectValue = actualDamageDealt;
                }
            } else {
                actionText = `${attacker.name} attacks ${defender.name} but misses!`;
                visualEffectType = 'text_indicator'; visualEffectValue = 'MISS!';
            }
            addNarrativeLog({ type: 'combat', text: actionText, icon: attackOutcomeIcon });
            if(visualEffectIcon) displayCombatVisualEffect(visualEffectType, visualEffectValue, defender.id, visualEffectIcon, visualEffectType === 'critical_indicator');
        }
         // Reset attacker's temporary combat flags after action
        if (attacker.combatStatus.isDefending) updateBrawlerCombatStatus({ isDefending: false }, attacker.id);
        // Dodge is usually a one-time use per activation, reset after an opponent's attack MISSES or HITS the dodger.
        // Here, we assume dodge buff wears off or is consumed if an attack was targeted at the dodger.
        // If attacker was dodging, it means they dodged previous turn. This turn they attack. So it remains.
        // If defender was dodging and was targeted, it's handled above.
    }

    // --- Resolution Phase ---
    const finalCurrentBrawlerState = gameContext.currentBrawler!; 
    const finalOpponentState = gameContext.opponent!;

    if (finalCurrentBrawlerState.currentHealth <= 0) {
      const tokensLost = Math.floor(brawlTokens * 0.1);
      const arenaPointsChange = -POINTS_PER_LOSS;
      addNarrativeLog({ type: 'error', text: "You have been defeated...", icon: <ShieldExclamationIcon className="w-4 h-4 text-kaspa-red"/> });
      updateBrawlTokens(-tokensLost); 
      updateBrawlerArenaPoints(arenaPointsChange, finalCurrentBrawlerState.id);
      addBattleToHistory({ opponentName: finalOpponentState.name, opponentClass: finalOpponentState.brawlerClass, result: 'loss', xpGained: 0, tokensGained: -tokensLost, arenaPointsChange });
      setBattleState(false, null); 
      setPostBattleSummary({ result: 'loss', opponentName: finalOpponentState.name, opponentClass: finalOpponentState.brawlerClass, xpGained: 0, tokensGained: -tokensLost, arenaPointsChange, timestamp: Date.now(), id: crypto.randomUUID() });
      setCurrentAttackerId(null); setIsAutoBattling(false); setLoading(false); return;
    }

    if (finalOpponentState.currentHealth <= 0) {
      const xpGained = Math.floor(Math.random() * 50) + 25 * finalOpponentState.level;
      const tokensFound = Math.floor(Math.random() * finalOpponentState.level * 10) + 20;
      const arenaPointsChange = POINTS_PER_WIN;
      addNarrativeLog({ type: 'reward', text: `${finalOpponentState.name} defeated! VICTORY!`, icon: <TrophyIcon className="w-4 h-4 text-yellow-400"/> });
      const brawlerWithXp = gainXp(finalCurrentBrawlerState, xpGained);
      setBrawler(brawlerWithXp); 
      updateBrawlerArenaPoints(arenaPointsChange, finalCurrentBrawlerState.id); 
      updateBrawlTokens(tokensFound);
      addBattleToHistory({ opponentName: finalOpponentState.name, opponentClass: finalOpponentState.brawlerClass, result: 'win', xpGained, tokensGained: tokensFound, arenaPointsChange });
      setBattleState(false, null); 
      setPostBattleSummary({ result: 'win', opponentName: finalOpponentState.name, opponentClass: finalOpponentState.brawlerClass, xpGained, tokensGained: tokensFound, arenaPointsChange, timestamp: Date.now(), id: crypto.randomUUID() });
      setCurrentAttackerId(null); setIsAutoBattling(false); setLoading(false); return;
    }
    
    setCurrentAttackerId(defender.id);
    incrementTurnNumber();
    setLoading(false);

  }, [
      currentBrawler, opponent, gameContext.currentBrawler, gameContext.opponent, 
      isBattleActive, currentAttackerId, addNarrativeLog, updateBrawlerHealth, 
      setBattleState, gainXp, setBrawler, updateBrawlTokens, brawlTokens, 
      addBattleToHistory, updateBrawlerCombatStatus, incrementTurnNumber, 
      setLoading, setIsAutoBattling, postBattleSummary, updateBrawlerArenaPoints,
      updateBrawlerMana, updateBrawlerSkillCooldown, addStatusEffectToBrawler,
      removeStatusEffectFromBrawler, updateStatusEffectDuration, turnNumber, contextIsLoading, updateStatusEffectValue
  ]);

  useEffect(() => {
    let battleTimer: ReturnType<typeof setTimeout>;
    if (isAutoBattling && isBattleActive && currentAttackerId && !postBattleSummary && currentBrawler && opponent && currentBrawler.currentHealth > 0 && opponent.currentHealth > 0 && !contextIsLoading) {
      battleTimer = setTimeout(() => {
        simulateAutoBattleRound();
      }, AUTO_BATTLE_DELAY);
    }
    return () => clearTimeout(battleTimer);
  }, [isAutoBattling, isBattleActive, currentAttackerId, postBattleSummary, simulateAutoBattleRound, currentBrawler, opponent, contextIsLoading]);


  useEffect(() => {
    return () => {
      if (isBattleActive) setBattleState(false, null);
      setCurrentAttackerId(null);
      setIsAutoBattling(false); 
    };
  }, [setBattleState, setIsAutoBattling]); 

  if (contextIsLoading && !isBattleActive && !opponent) { 
    return (
        <div className="flex-grow flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
            <LoadingSpinner size="w-16 h-16" />
            <p className="mt-4 text-xl font-orbitron text-kaspa-gray">Finalizing Arena Setup...</p>
        </div>
    );
  }

  if (!currentBrawler) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="w-16 h-16"/> <p className="ml-4 text-xl font-orbitron">Loading Brawler...</p></div>;
  }
  
  const statIcons:  Record<keyof BrawlerStats, React.ReactElement> = {
    strength: <FistIcon className="w-4 h-4"/>, health: <HeartIcon className="w-4 h-4"/>,
    maxHealth: <HeartIcon className="w-4 h-4"/>, armor: <ShieldIcon className="w-4 h-4"/>,
    agility: <WindIcon className="w-4 h-4"/>, intelligence: <BeakerIcon className="w-4 h-4"/>,
    mana: <SparklesIcon className="w-4 h-4"/>, maxMana: <SparklesIcon className="w-4 h-4"/>,
    luck: <SunIcon className="w-4 h-4"/>, accuracy: <EyeIcon className="w-4 h-4"/>,
  };

  if (postBattleSummary) {
    return (
        <Modal isOpen={true} onClose={() => { setPostBattleSummary(null); navigate('/hub');}} title={postBattleSummary.result === 'win' ? "VICTORY!" : "DEFEAT"}>
            <div className="text-center">
                {postBattleSummary.result === 'win' ? (
                    <TrophyIcon className="w-24 h-24 text-yellow-400 mx-auto mb-4"/>
                ) : (
                    <ShieldExclamationIcon className="w-24 h-24 text-red-500 mx-auto mb-4"/>
                )}
                <p className="text-xl text-kaspa-light-gray mb-2">
                    You {postBattleSummary.result === 'win' ? 'defeated' : 'were defeated by'} {postBattleSummary.opponentName}!
                </p>
                <p className="text-kaspa-green">XP Gained: +{postBattleSummary.xpGained}</p>
                <p className={`${(postBattleSummary.tokensGained ?? 0) >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    BRAWL Tokens: {(postBattleSummary.tokensGained ?? 0) >= 0 ? '+' : ''}{postBattleSummary.tokensGained}
                </p>
                {postBattleSummary.arenaPointsChange !== undefined && (
                    <p className={`${postBattleSummary.arenaPointsChange >= 0 ? 'text-teal-400' : 'text-pink-400'}`}>
                        Arena Points: {postBattleSummary.arenaPointsChange >= 0 ? '+' : ''}{postBattleSummary.arenaPointsChange}
                    </p>
                )}
                <ActionButton onClick={() => { setPostBattleSummary(null); navigate('/hub'); }} variant="primary" className="w-full mt-8">
                    Back to Hub
                </ActionButton>
            </div>
        </Modal>
    );
  }

  return (
    <div className={`py-2 sm:py-6 min-h-[calc(100vh-180px)] flex flex-col ${isBattleActive ? 'battle-arena-bg' : ''}`}>
      {!isBattleActive && globalCurrentEvent ? ( 
        // ... (Non-battle UI - unchanged)
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto flex-grow w-full">
          <div className="md:col-span-1 card-bg p-3 sm:p-4 rounded-xl shadow-purple-glow space-y-3 self-start sticky top-24">
            <div className="flex items-center space-x-3 pb-3 border-b border-kaspa-purple/30">
                <UserCircleIcon className="w-12 h-12 text-kaspa-teal"/>
                <div>
                    <h2 className="text-lg sm:text-xl font-orbitron text-kaspa-purple">{currentBrawler.name}</h2>
                    <p className="text-xs text-kaspa-gray">{currentBrawler.brawlerClass} - Lvl {currentBrawler.level}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {Object.entries(currentBrawler.stats).filter(([key]) => !key.startsWith('max') && key !== 'health' && key !== 'mana').map(([key, value]) => (
                    <StatDisplayItem key={key} icon={statIcons[key as keyof BrawlerStats] || <PuzzlePieceIcon className="w-4 h-4"/>} label={key} value={value as number} description={STAT_DESCRIPTIONS[key as keyof BrawlerStats]} />
                ))}
                <StatDisplayItem icon={<HeartIcon className="w-4 h-4"/>} label="Health" value={currentBrawler.currentHealth} maxValue={currentBrawler.stats.maxHealth} description={STAT_DESCRIPTIONS.health} />
                <StatDisplayItem icon={<SparklesIcon className="w-4 h-4"/>} label="Mana" value={currentBrawler.currentMana} maxValue={currentBrawler.stats.maxMana} description={STAT_DESCRIPTIONS.mana}/>
            </div>
            <StatBar label="XP" value={currentBrawler.xp} maxValue={currentBrawler.xpToNextLevel} colorClass="bg-yellow-500"/>
            <div className="flex flex-wrap items-center justify-between text-kaspa-gray pt-1 text-sm">
                <div className="flex items-center space-x-1">
                    <CurrencyDollarIcon className="w-5 h-5 text-yellow-400"/> 
                    <span>BRAWL: <span className="font-bold text-yellow-400">{brawlTokens}</span></span>
                </div>
                {isWalletConnected && kasBalance !== null && (
                    <div className="flex items-center space-x-1">
                        <WalletIcon className="w-4 h-4 text-kaspa-green" />
                        <span>KAS: <span className="font-bold text-kaspa-green">{kasBalance.toFixed(2)}</span></span>
                    </div>
                )}
            </div>
            <ActionButton onClick={() => setShowInventoryModal(true)} variant="outline" className="w-full !py-2 text-sm">
                <BackpackIcon className="w-5 h-5 mr-2" /> Inventory ({inventory.length})
            </ActionButton>
          </div>

          <div className="md:col-span-2 card-bg p-3 sm:p-6 rounded-xl shadow-teal-glow flex flex-col">
            <h3 className="text-xl sm:text-2xl font-orbitron text-kaspa-teal mb-3 border-b border-kaspa-teal/30 pb-2">
                {globalCurrentEvent?.title || "KaspaVerse Log"}
            </h3>
            <div className="flex-grow h-60 sm:h-80 overflow-y-auto mb-3 p-2 bg-kaspa-deep-blue/50 rounded border border-kaspa-purple/30 space-y-1.5 text-sm pretty-scrollbar">
              {narrativeLog.map(entry => (
                <p key={entry.id} className={`flex items-start leading-relaxed
                  ${entry.type === 'narrative' ? 'text-kaspa-light-gray/90' : ''}
                  ${entry.type === 'combat' ? 'text-red-300 italic' : ''}
                  ${entry.type === 'reward' ? 'text-green-300 font-semibold' : ''}
                  ${entry.type === 'system' ? 'text-kaspa-gray text-xs' : ''}
                  ${entry.type === 'error' ? 'text-red-500 font-bold' : ''}
                  ${entry.type === 'wallet' ? 'text-kaspa-teal text-xs' : ''}
                   ${entry.type === 'status' ? 'text-sky-300 text-xs italic' : ''}
                `}>
                  {entry.icon && React.cloneElement(entry.icon, {className: "w-3.5 h-3.5 mr-1.5 mt-1 flex-shrink-0"})}
                  <span className="flex-1">[{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] {entry.text}</span>
                </p>
              ))}
              {contextIsLoading && !isBattleActive && <div className="flex items-center text-kaspa-gray"><LoadingSpinner size="w-4 h-4 mr-2"/> Thinking...</div>}
            </div>
            {globalCurrentEvent && !contextIsLoading && (
              <div className="space-y-2">
                {globalCurrentEvent.choices.map((choice, index) => (
                  <ActionButton key={index} onClick={() => handleChoiceAction(choice, currentBrawler)} disabled={contextIsLoading} variant="outline" className="w-full text-left justify-start !py-2.5 text-sm">
                    {choice.text}
                  </ActionButton>
                ))}
                 <ActionButton onClick={() => { if(currentBrawler) fetchNarrativeEvent(currentBrawler);}} disabled={contextIsLoading} variant="secondary" className="w-full mt-2 !py-2 text-sm">
                    <ArrowPathIcon className="w-4 h-4 mr-2"/> Skip / New Encounter
                </ActionButton>
              </div>
            )}
          </div>
        </div>
      ) : isBattleActive && opponent ? ( 
          <div className="flex-grow flex flex-col items-center justify-between p-1 sm:p-2 relative w-full">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center justify-items-center my-auto">
                 <BattleBrawlerCard brawler={currentBrawler} isPlayer className="order-2 md:order-1"/>
                 <BattleBrawlerCard brawler={opponent} className="order-1 md:order-2"/>
            </div>
            
            {activeCombatVisualEffect && (
                <div 
                    key={activeCombatVisualEffect.id} 
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-3 px-4 rounded-lg text-white font-orbitron text-xl sm:text-2xl flex items-center space-x-2.5 shadow-xl action-feedback-anim
                        ${activeCombatVisualEffect.isCritical ? 'bg-yellow-500/90 !text-black scale-110' : 
                         activeCombatVisualEffect.type === 'damage' ? (activeCombatVisualEffect.targetId === currentBrawler.id ? 'bg-kaspa-pink/90' : 'bg-kaspa-red/90') : 
                         activeCombatVisualEffect.type === 'heal' ? 'bg-kaspa-green/90' :
                         activeCombatVisualEffect.type === 'status' ? 'bg-sky-500/90' :
                         activeCombatVisualEffect.type === 'text_indicator' && (activeCombatVisualEffect.value === "MISS!" || activeCombatVisualEffect.value === "DODGED!") ? 'bg-gray-600/90' :
                         'bg-kaspa-purple/90'}`}
                >
                {activeCombatVisualEffect.isCritical && <SparklesIcon className="w-6 h-6 text-black animate-pulse"/>}
                {activeCombatVisualEffect.icon}
                <span>{activeCombatVisualEffect.value}{activeCombatVisualEffect.isCritical ? "!!" : ""}</span>
                </div>
            )}

            <div className="w-full max-w-3xl card-bg p-2 sm:p-4 rounded-xl shadow-purple-glow mt-4">
                <div className="text-center mb-2">
                    <p className="text-lg font-orbitron text-kaspa-teal">ARENA AUTO-BATTLE</p>
                    <p className="text-sm text-kaspa-gray">Turn: {turnNumber}</p>
                </div>
              <div className="h-48 sm:h-56 overflow-y-auto mb-3 p-2 bg-kaspa-deep-blue/60 rounded border border-kaspa-purple/40 space-y-1 text-xs sm:text-sm pretty-scrollbar">
                {narrativeLog.filter(e => ['combat', 'reward', 'system', 'error', 'skill', 'status'].includes(e.type)).slice(-30).map(entry => ( 
                   <p key={entry.id} className={`flex items-start
                    ${entry.type === 'combat' ? (entry.text.toLowerCase().includes(currentBrawler.name.toLowerCase()) && !entry.text.toLowerCase().includes("takes damage") && !entry.text.toLowerCase().includes("misses") ? 'text-green-300/90' : 'text-pink-300/90') : ''}
                    ${entry.type === 'skill' ? (entry.text.toLowerCase().includes(currentBrawler.name.toLowerCase()) ? 'text-teal-300/90' : 'text-purple-300/90') : ''}
                    ${entry.text.includes("CRITICAL HIT!") ? 'font-bold text-yellow-300' : ''}
                    ${entry.type === 'reward' ? 'text-yellow-300 font-semibold' : ''}
                    ${entry.type === 'system' ? 'text-kaspa-gray' : ''}
                    ${entry.type === 'error' ? 'text-red-500 font-bold' : ''}
                    ${entry.type === 'status' ? 'text-sky-300 italic' : ''}
                  `}>
                    {entry.icon && React.cloneElement(entry.icon, {className: "w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0"})}
                    <span className="flex-1">[{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] {entry.text}</span>
                  </p>
                ))}
                 {contextIsLoading && isBattleActive && <div className="flex items-center text-kaspa-gray"><LoadingSpinner size="w-4 h-4 mr-1.5"/>Simulating...</div>}
              </div>
            </div>
          </div>
        ) : ( 
            <div className="flex-grow flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
                <LoadingSpinner size="w-16 h-16" />
                <p className="mt-4 text-xl font-orbitron text-kaspa-gray">Preparing Arena...</p>
            </div>
        )
      )}

      <Modal isOpen={showInventoryModal} onClose={() => setShowInventoryModal(false)} title="Inventory">
        {inventory.length === 0 ? (
          <p className="text-kaspa-gray">Your backpack is empty.</p>
        ) : (
          <ul className="space-y-3 max-h-96 overflow-y-auto pretty-scrollbar pr-2">
            {inventory.map(item => (
              <li key={item.id} className="p-3 bg-kaspa-deep-blue/70 rounded border border-kaspa-purple/30">
                <h4 className="font-semibold text-kaspa-teal">{item.name} <span className="text-xs text-kaspa-gray capitalize">({item.type}, {item.rarity})</span></h4>
                <p className="text-xs text-kaspa-light-gray">{item.description}</p>
                {item.statBonuses && (
                  <p className="text-xs text-green-400 mt-1">
                    Bonuses: {Object.entries(item.statBonuses).map(([key, val]) => `${key.toUpperCase().substring(0,3)} +${val}`).join(', ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

const handleChoiceAction = async (choice: NarrativeChoice, brawlerInstance: Brawler | null) => {
    // This function is for non-battle narrative choices.
    // It might initiate a battle, give rewards, or lead to another event.
    // For now, it's mostly a placeholder for future expansion.
    if (!brawlerInstance) return;
    console.log("Narrative choice made:", choice.text, "by", brawlerInstance.name);
    // Example: gameContext.addNarrativeLog({type: 'system', text: `You chose: ${choice.text}`});
    // Potentially call fetchNarrativeEvent again or setBattleState based on choice.
};

export default GamePage;
