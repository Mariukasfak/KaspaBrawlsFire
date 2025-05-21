
import { Brawler, BrawlerClass, BrawlerStats, ClassDescription, CombatStatus, Skill, GameItem, ArenaTier } from '../types';
import { BRAWLER_CLASSES, INITIAL_STATS, XP_PER_LEVEL_BASE, HEALTH_POTION, INITIAL_ARENA_POINTS, ARENA_TIERS } from '../constants';
import { generateBrawlerLore } from './geminiService';

const generateRandomStat = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const initialCombatStatus = (): CombatStatus => ({
  isDefending: false,
  isDodging: false,
  turnsUntilSpecialReady: 3, 
});

export const calculateArenaTier = (points: number): ArenaTier => {
  let currentTier = ARENA_TIERS[0].tier; // Default to the lowest tier
  for (let i = ARENA_TIERS.length - 1; i >= 0; i--) {
    if (points >= ARENA_TIERS[i].minPoints) {
      currentTier = ARENA_TIERS[i].tier;
      break;
    }
  }
  return currentTier;
};

export const createNewBrawler = async (name: string, selectedClass: BrawlerClass): Promise<Brawler> => {
  const classInfo = BRAWLER_CLASSES.find(c => c.name === selectedClass);
  if (!classInfo) {
    throw new Error(`Invalid brawler class: ${selectedClass}`);
  }

  const baseStatsConfig = INITIAL_STATS[selectedClass];
  const stats: BrawlerStats = {
    strength: generateRandomStat(baseStatsConfig.strength[0], baseStatsConfig.strength[1]),
    health: generateRandomStat(baseStatsConfig.health[0], baseStatsConfig.health[1]),
    maxHealth: 0, 
    armor: generateRandomStat(baseStatsConfig.armor[0], baseStatsConfig.armor[1]),
    agility: generateRandomStat(baseStatsConfig.agility[0], baseStatsConfig.agility[1]),
    intelligence: generateRandomStat(baseStatsConfig.intelligence[0], baseStatsConfig.intelligence[1]),
    mana: generateRandomStat(baseStatsConfig.mana[0], baseStatsConfig.mana[1]), // Use new mana ranges from class
    maxMana: 0, 
    luck: generateRandomStat(baseStatsConfig.luck[0], baseStatsConfig.luck[1]),
    accuracy: generateRandomStat(baseStatsConfig.accuracy[0], baseStatsConfig.accuracy[1]),
  };
  stats.maxHealth = stats.health; 
  stats.maxMana = stats.mana; 

  const lore = await generateBrawlerLore(name, selectedClass);

  // Initialize skills with currentCooldown set to 0
  const brawlerSkills: Skill[] = classInfo.skills.map(skill => ({ ...skill, currentCooldown: 0 }));
  
  // Initialize with one health potion
  const initialItems: GameItem[] = [{ ...HEALTH_POTION, quantity: 1 }];


  return {
    id: crypto.randomUUID(),
    name,
    brawlerClass: selectedClass,
    stats,
    currentHealth: stats.maxHealth,
    currentMana: stats.maxMana,
    lore,
    level: 1,
    xp: 0,
    xpToNextLevel: XP_PER_LEVEL_BASE,
    combatStatus: initialCombatStatus(),
    skills: brawlerSkills,
    activeStatusEffects: [],
    items: initialItems,
    arenaPoints: INITIAL_ARENA_POINTS,
    currentArenaTier: calculateArenaTier(INITIAL_ARENA_POINTS),
  };
};


export const calculateXpToNextLevel = (level: number): number => {
  return XP_PER_LEVEL_BASE * Math.pow(level, 1.5); 
};

export const gainXp = (brawler: Brawler, amount: number): Brawler => {
  let newXp = brawler.xp + amount;
  let newLevel = brawler.level;
  let newStats = { ...brawler.stats };
  let xpToNext = brawler.xpToNextLevel;
  let newCurrentHealth = brawler.currentHealth;
  let newCurrentMana = brawler.currentMana;


  while (newXp >= xpToNext) {
    newXp -= xpToNext;
    newLevel++;
    
    const classInfo = BRAWLER_CLASSES.find(c => c.name === brawler.brawlerClass);
    if (classInfo) {
        // @ts-ignore
      newStats[classInfo.primaryStat] = (newStats[classInfo.primaryStat] || 0) + 1;
      // Also give a point to a secondary stat or a random one
      const secondaryStats = (Object.keys(newStats) as Array<keyof BrawlerStats>).filter(s => s !== classInfo.primaryStat && s !== 'maxHealth' && s !== 'maxMana' && s !== 'health' && s !== 'mana');
      const randomSecondaryStat = secondaryStats[Math.floor(Math.random() * secondaryStats.length)];
      // @ts-ignore
      newStats[randomSecondaryStat] = (newStats[randomSecondaryStat] || 0) + 1;
    }
    newStats.maxHealth += 5; // All classes get some HP
    newStats.health = newStats.maxHealth; 
    newCurrentHealth = newStats.maxHealth; 

    const manaIncrease = classInfo?.baseStats.mana[1] ? Math.floor(classInfo.baseStats.mana[1] * 0.1) + 2 : 5; // Increase max mana based on class potential
    newStats.maxMana += manaIncrease;
    newStats.mana = newStats.maxMana; 
    newCurrentMana = newStats.maxMana; 

    xpToNext = calculateXpToNextLevel(newLevel);
  }

  // Reset skill cooldowns on level up for a fresh start
  const refreshedSkills = brawler.skills.map(skill => ({ ...skill, currentCooldown: 0 }));

  return {
    ...brawler,
    level: newLevel,
    xp: newXp,
    xpToNextLevel: xpToNext,
    stats: newStats,
    currentHealth: newCurrentHealth,
    currentMana: newCurrentMana,
    skills: refreshedSkills,
  };
};

export const createDefaultBrawler = async (): Promise<Brawler> => {
    const name = "Cyber Shogun";
    const brawlerClass = BrawlerClass.CRIMSON_BRUTE;
    const classInfo = BRAWLER_CLASSES.find(c => c.name === brawlerClass)!;
    
    const stats: BrawlerStats = {
        strength: 12, health: 55, maxHealth: 55, armor: 7, agility: 4,
        intelligence: 2, mana: 20, maxMana: 20, luck: 3, accuracy: 5, // Adjusted mana for Brute
    };
     stats.maxHealth = stats.health;
     stats.maxMana = stats.mana;

    const lore = "Born in the depths of Kaspa, trained in the Shadow Arena. A legendary fighter destined for glory.";
    const brawlerSkills: Skill[] = classInfo.skills.map(skill => ({ ...skill, currentCooldown: 0 }));
    const initialItems: GameItem[] = [{ ...HEALTH_POTION, quantity: 1 }];


    return {
        id: 'default-brawler',
        name: "KASPA BRAWLER", 
        brawlerClass,
        stats,
        currentHealth: stats.maxHealth,
        currentMana: stats.maxMana,
        lore,
        level: 1, 
        xp: 0,
        xpToNextLevel: XP_PER_LEVEL_BASE,
        combatStatus: initialCombatStatus(),
        skills: brawlerSkills,
        activeStatusEffects: [],
        items: initialItems,
        arenaPoints: INITIAL_ARENA_POINTS,
        currentArenaTier: calculateArenaTier(INITIAL_ARENA_POINTS),
    };
}
