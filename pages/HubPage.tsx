
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { BRAWLER_CLASSES, ARENA_TIERS } from '../constants'; // Import ARENA_TIERS
import { ActionButton, SectionTitle, Modal, LoadingSpinner } from '../components/uiElements';
// HACK: Added Cog6ToothIcon and QuestionMarkCircleIcon to import
import { UserCircleIcon, BackpackIcon, CommandLineIcon, TrophyIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ShieldExclamationIcon } from '../components/Icons';
import { BattleBrawlerCard } from '../components/BattleBrawlerCard'; // For a consistent look or make a new HubBrawlerDisplay

const HubPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentBrawler, 
    isWalletConnected, 
    kasAddress, 
    kasBalance, 
    inventory, 
    battleHistory,
    isLoading 
  } = useGameContext();
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  if (isLoading && !currentBrawler) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="w-16 h-16"/><p className="ml-4 text-xl font-orbitron">Loading Hub...</p></div>;
  }

  if (!isWalletConnected || !currentBrawler) {
    navigate('/'); // Should not happen if routing in App.tsx is correct, but as a safeguard
    return null;
  }

  const classInfo = BRAWLER_CLASSES.find(c => c.name === currentBrawler.brawlerClass);
  const avatarIcon = classInfo ? React.cloneElement(classInfo.icon, { className: "w-24 h-24 sm:w-32 sm:h-32 text-white" }) : <UserCircleIcon className="w-24 h-24 sm:w-32 sm:h-32 text-kaspa-gray" />;
  const avatarBgClasses = classInfo ? classInfo.avatarGradient : "bg-gradient-to-br from-gray-700 to-gray-800";
  
  const formatKasAddress = (address: string | null) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 10)}...${address.substring(address.length - 6)}`;
  };

  const currentTierInfo = ARENA_TIERS.find(t => t.tier === currentBrawler.currentArenaTier) || ARENA_TIERS[0];


  return (
    <div className="py-6 sm:py-10 space-y-10">
      <SectionTitle>GAME <span className="text-kaspa-teal">HUB</span></SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Player Profile & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Player Profile Card */}
          <div className="card-bg p-4 sm:p-6 rounded-xl shadow-purple-glow text-center">
            <div className={`mx-auto w-32 h-32 sm:w-40 sm:h-40 rounded-full ${avatarBgClasses} flex items-center justify-center border-4 ${classInfo?.borderColorClass || 'border-kaspa-purple'} mb-4`}>
              {avatarIcon}
            </div>
            <h2 className="text-2xl sm:text-3xl font-orbitron text-white">{currentBrawler.name}</h2>
            <p className="text-sm text-kaspa-gray mb-1">{currentBrawler.brawlerClass} - LvL {currentBrawler.level}</p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-2 ${currentTierInfo.badgeBg} ${currentTierInfo.iconColor}`}>
                <TrophyIcon className={`w-3 h-3 mr-1.5 ${currentTierInfo.iconColor}`} />
                {currentBrawler.currentArenaTier} - {currentBrawler.arenaPoints} AP
            </div>
            <p className="text-xs text-kaspa-teal font-mono mb-3" title={kasAddress || undefined}>{formatKasAddress(kasAddress)}</p>
            <p className="text-lg font-bold text-kaspa-green mb-4">{kasBalance?.toFixed(2) ?? '0.00'} KAS</p>
            <ActionButton onClick={() => alert("Edit Brawler - Coming Soon!")} variant="outline" className="w-full !py-2 text-xs mb-3">
              Switch Brawler (Soon)
            </ActionButton>
             <ActionButton onClick={() => setIsInventoryOpen(true)} variant="secondary" className="w-full !py-2 text-xs">
              <BackpackIcon className="w-4 h-4 mr-2"/> View Inventory ({inventory.length})
            </ActionButton>
          </div>

          {/* Quick Actions */}
          <div className="card-bg p-4 sm:p-6 rounded-xl shadow-teal-glow space-y-3">
            <ActionButton onClick={() => navigate('/matchmaking')} variant="primary" className="w-full !py-3 text-lg">
              <CommandLineIcon className="w-6 h-6 mr-2"/> ENTER ARENA
            </ActionButton>
            <ActionButton disabled variant="secondary" className="w-full !py-3 text-lg opacity-50 cursor-not-allowed">
              Story Mode (Soon)
            </ActionButton>
            <div className="grid grid-cols-2 gap-3 pt-2">
                 <ActionButton disabled variant="outline" className="w-full !py-2 text-xs opacity-50">Leaderboards</ActionButton>
                 <ActionButton disabled variant="outline" className="w-full !py-2 text-xs opacity-50">Quests</ActionButton>
                 <ActionButton disabled variant="outline" className="w-full !py-2 text-xs opacity-50"><Cog6ToothIcon className="w-4 h-4 mr-1"/>Settings</ActionButton>
                 <ActionButton disabled variant="outline" className="w-full !py-2 text-xs opacity-50"><QuestionMarkCircleIcon className="w-4 h-4 mr-1"/>Help</ActionButton>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Fights */}
        <div className="lg:col-span-2 card-bg p-4 sm:p-6 rounded-xl shadow-purple-glow">
          <h3 className="text-xl sm:text-2xl font-orbitron text-kaspa-light-gray mb-4 pb-2 border-b border-kaspa-purple/30">
            RECENT <span className="text-kaspa-teal">FIGHTS</span>
          </h3>
          {battleHistory.length > 0 ? (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pretty-scrollbar pr-2">
              {battleHistory.map(fight => {
                 const opponentClassInfo = BRAWLER_CLASSES.find(c => c.name === fight.opponentClass);
                 const opponentIcon = opponentClassInfo ? React.cloneElement(opponentClassInfo.icon, {className: "w-6 h-6"}) : <UserCircleIcon className="w-6 h-6"/>;
                 const arenaPointsText = fight.arenaPointsChange !== undefined 
                    ? `${fight.arenaPointsChange >= 0 ? '+' : ''}${fight.arenaPointsChange} AP` 
                    : '';
                 const arenaPointsColor = fight.arenaPointsChange !== undefined 
                    ? (fight.arenaPointsChange >= 0 ? 'text-teal-400' : 'text-pink-400') 
                    : 'text-kaspa-gray';

                return (
                <div key={fight.id} className={`p-3 rounded-lg border flex items-center justify-between ${fight.result === 'win' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <div className="flex items-center space-x-3">
                    <span className={`p-1.5 rounded-full ${fight.result === 'win' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {fight.result === 'win' ? <TrophyIcon className="w-5 h-5 text-green-400"/> : <ShieldExclamationIcon className="w-5 h-5 text-red-400"/>}
                    </span>
                    <div>
                      <p className={`font-semibold ${fight.result === 'win' ? 'text-green-300' : 'text-red-300'}`}>
                        {fight.result === 'win' ? 'Victory' : 'Defeat'} vs {fight.opponentName}
                         {fight.arenaPointsChange !== undefined && <span className={`ml-2 text-xs font-normal ${arenaPointsColor}`}>({arenaPointsText})</span>}
                      </p>
                      <p className="text-xs text-kaspa-gray">
                        vs <span className={`font-medium text-${opponentClassInfo?.themeColorName || 'kaspa-gray'}`}>{fight.opponentClass}</span>
                        {' '}| {new Date(fight.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className={`p-1.5 rounded-full ${opponentClassInfo?.avatarGradient || 'bg-gray-700'} text-white`}>
                     {opponentIcon}
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <p className="text-kaspa-gray text-center py-10">No recent fights recorded. Enter the Arena!</p>
          )}
        </div>
      </div>

      {/* Inventory Modal */}
      <Modal isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} title="Your Inventory">
        {inventory.length === 0 ? (
          <p className="text-kaspa-gray">Your backpack is empty. Fight in the arena to find items!</p>
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
                {/* Add Equip/Use button here if needed */}
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default HubPage;
