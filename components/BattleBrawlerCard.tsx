
import React, { useState } from 'react';
import { Brawler, BrawlerClass, ClassDescription, StatusEffect } from '../types';
import { StatBar } from './uiElements';
import { BRAWLER_CLASSES } from '../constants';
import { UserCircleIcon, ShieldIcon as DefenseIcon, WindIcon as DodgeIcon, StopIcon } from './Icons'; // Default icon & status icons

interface BattleBrawlerCardProps {
  brawler: Brawler;
  isPlayer?: boolean;
  className?: string;
}

const StatusEffectIconDisplay: React.FC<{ effect: StatusEffect }> = ({ effect }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {React.cloneElement(effect.icon, { className: `w-5 h-5 p-0.5 ${effect.type === 'stun' ? 'bg-yellow-600/70 rounded-sm' : effect.type.includes('buff') ? 'bg-green-600/70 rounded-sm': effect.type.includes('debuff') || effect.type.includes('damage_over_time') ? 'bg-red-600/70 rounded-sm' : 'bg-gray-600/70 rounded-sm' }` })}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 w-max min-w-[100px] max-w-[150px] p-1.5 bg-kaspa-deep-blue text-white text-xs rounded shadow-lg z-30 border border-kaspa-purple/50 text-center">
          {effect.name} ({effect.duration}t)
        </div>
      )}
    </div>
  );
};


export const BattleBrawlerCard: React.FC<BattleBrawlerCardProps> = ({ brawler, isPlayer = false, className }) => {
  const classInfo = BRAWLER_CLASSES.find(c => c.name === brawler.brawlerClass);
  
  const avatarIcon = classInfo ? React.cloneElement(classInfo.icon, { className: "w-16 h-16 sm:w-20 sm:h-20 text-white" }) : <UserCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-kaspa-gray" />;
  const avatarBgClasses = classInfo ? classInfo.avatarGradient : "bg-gradient-to-br from-gray-700 to-gray-800";
  const borderClass = classInfo ? classInfo.borderColorClass : (isPlayer ? 'border-kaspa-teal' : 'border-kaspa-pink');
  const shadowClass = classInfo ? classInfo.shadowColorClass : (isPlayer ? 'shadow-teal-glow' : 'shadow-red-glow');
  const nameColorClass = classInfo ? `text-${classInfo.themeColorName}` : (isPlayer ? 'text-kaspa-teal' : 'text-kaspa-pink');


  return (
    <div className={`card-bg p-3 sm:p-4 rounded-xl shadow-lg relative w-full max-w-xs sm:max-w-sm mx-auto ${className} ${borderClass} ${shadowClass} border-2`}>
      <div className={`absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full ${avatarBgClasses} flex items-center justify-center brawler-avatar-bg ${borderClass}`}>
        {avatarIcon}
      </div>
      <div className="mt-16 sm:mt-20 text-center">
        <h3 className={`text-xl sm:text-2xl font-orbitron ${nameColorClass}`}>{brawler.name}</h3>
        <p className="text-xs text-kaspa-gray mb-3">Lvl {brawler.level} {brawler.brawlerClass}</p>
      </div>
      <div className="space-y-2 px-1 sm:px-2">
        <StatBar
          label="HP"
          value={brawler.currentHealth}
          maxValue={brawler.stats.maxHealth}
          colorClass={isPlayer ? "bg-kaspa-green" : `bg-${classInfo?.themeColorName || 'kaspa-red'}`}
        />
        {brawler.stats.maxMana > 0 && (
          <StatBar
            label="MP"
            value={brawler.currentMana}
            maxValue={brawler.stats.maxMana}
            colorClass="bg-kaspa-blue"
          />
        )}
      </div>
       <div className="flex justify-center items-center space-x-1.5 mt-3 h-8 overflow-x-auto pretty-scrollbar pb-1 px-1">
            {brawler.combatStatus.isDefending && 
                <span title="Defending" className="flex items-center text-xs bg-kaspa-blue/80 text-white px-2 py-0.5 rounded-full shadow-md">
                    <DefenseIcon className="w-3 h-3 mr-1"/> DEF
                </span>
            }
            {brawler.combatStatus.isDodging && 
                <span title="Dodging" className="flex items-center text-xs bg-kaspa-green/80 text-white px-2 py-0.5 rounded-full shadow-md">
                    <DodgeIcon className="w-3 h-3 mr-1"/> DGE
                </span>
            }
            {brawler.combatStatus.isStunned && 
                <span title="Stunned" className="flex items-center text-xs bg-yellow-500/80 text-black px-2 py-0.5 rounded-full shadow-md">
                    <StopIcon className="w-3 h-3 mr-1"/> STN
                </span>
            }
            {brawler.activeStatusEffects.map(effect => (
              <StatusEffectIconDisplay key={effect.id} effect={effect} />
            ))}
        </div>
    </div>
  );
};
