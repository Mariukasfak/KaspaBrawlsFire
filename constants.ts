
import React from 'react';
import { BrawlerClass, BaseStats, ClassDescription, RoadmapStep, HowItWorksItem, Skill, GameItem, ArenaTier, StatusEffectDefinition } from './types';
// FIX: Correctly import LightningBoltIcon (aliased as ManaRegenIcon) and ensure it's used consistently.
// LightningBoltIcon is imported and aliased as ManaRegenIcon, so ManaRegenIcon should be used for the Chain Lightning skill icon.
import { PlusIcon, ShieldCheckIcon, ShieldIcon as DefenseIcon, SparklesIcon, TrophyIcon, PuzzlePieceIcon, CommandLineIcon, FistIcon, DaggerIcon, HeartIcon, BoltIcon, WindIcon, SunIcon, EyeIcon, FireIcon, TrendingUpIcon, TrendingDownIcon, StopIcon, LightningBoltIcon as ManaRegenIcon } from './components/Icons'; // Added FireIcon, TrendingUp/Down, StopIcon, ManaRegenIcon

export const DEFAULT_BRAWL_TOKENS = 100;
export const XP_PER_LEVEL_BASE = 100;
export const INITIAL_ARENA_POINTS = 1000;
export const POINTS_PER_WIN = 25;
export const POINTS_PER_LOSS = 15;


export interface ArenaTierDetail {
  tier: ArenaTier;
  minPoints: number;
  name: string;
  iconColor: string; // Tailwind color class e.g. text-gray-400
  badgeBg: string; // Tailwind background class e.g. bg-gray-700
}

export const ARENA_TIERS: ArenaTierDetail[] = [
  { tier: ArenaTier.RUSTED_CIRCUIT, minPoints: 0, name: 'Rusted Circuit', iconColor: 'text-gray-400', badgeBg: 'bg-gray-600/80' },
  { tier: ArenaTier.BRONZE_LEAGUE, minPoints: 1100, name: 'Bronze League', iconColor: 'text-yellow-600', badgeBg: 'bg-yellow-700/80' },
  { tier: ArenaTier.SILVER_DATASTREAM, minPoints: 1300, name: 'Silver Datastream', iconColor: 'text-gray-300', badgeBg: 'bg-gray-500/80' },
  { tier: ArenaTier.GOLD_PROTOCOL, minPoints: 1600, name: 'Gold Protocol', iconColor: 'text-yellow-400', badgeBg: 'bg-yellow-500/80' },
  { tier: ArenaTier.CYBERNETIC_LEGEND, minPoints: 2000, name: 'Cybernetic Legend', iconColor: 'text-teal-400', badgeBg: 'bg-teal-600/80' },
  { tier: ArenaTier.VOID_MASTER, minPoints: 2500, name: 'Void Master', iconColor: 'text-purple-400', badgeBg: 'bg-purple-600/80' },
];

export const STATUS_EFFECT_DEFINITIONS: Record<string, StatusEffectDefinition> = {
  IRON_SKIN: {
    key: 'IRON_SKIN',
    name: 'Iron Skin',
    description: 'Reduces incoming physical damage.',
    icon: React.createElement(DefenseIcon, {className: "w-4 h-4 text-gray-300"}),
    defaultDuration: 2,
    type: 'damage_reduction',
    value: 30, // 30% damage reduction
    valueType: 'percentage',
  },
  MANA_SHIELD: {
    key: 'MANA_SHIELD',
    name: 'Mana Shield',
    description: 'Absorbs incoming damage.',
    icon: React.createElement(BoltIcon, {className: "w-4 h-4 text-blue-400"}),
    defaultDuration: 3, // Or until broken
    type: 'absorb_shield',
    value: 25, // Shield HP
    valueType: 'flat',
  },
  SMOKE_BOMB_DODGE: {
    key: 'SMOKE_BOMB_DODGE',
    name: 'Evasive Cloud',
    description: 'Increased dodge chance.',
    icon: React.createElement(WindIcon, {className: "w-4 h-4 text-green-400"}),
    defaultDuration: 1,
    type: 'dodge_increase',
    value: 50, // 50% increased dodge (example interpretation)
    valueType: 'percentage', // This might be a flat modifier to dodge calculation rather than a direct stat change
  },
   BURNING: {
    key: 'BURNING',
    name: 'Burning',
    description: 'Deals fire damage each turn.',
    icon: React.createElement(FireIcon, {className: "w-4 h-4 text-orange-500"}),
    defaultDuration: 3,
    type: 'damage_over_time',
    value: 5, // 5 damage per turn
    valueType: 'flat',
    tickOnApplication: false,
  },
  STRENGTH_BUFF: {
    key: 'STRENGTH_BUFF',
    name: 'Strengthened',
    description: 'Strength increased.',
    icon: React.createElement(TrendingUpIcon, {className: "w-4 h-4 text-red-500"}),
    defaultDuration: 3,
    type: 'stat_buff',
    statAffected: 'strength',
    value: 5,
    valueType: 'flat',
  },
  ARMOR_DEBUFF: {
    key: 'ARMOR_DEBUFF',
    name: 'Armor Shattered',
    description: 'Armor reduced.',
    icon: React.createElement(TrendingDownIcon, {className: "w-4 h-4 text-gray-400"}),
    defaultDuration: 2,
    type: 'stat_debuff',
    statAffected: 'armor',
    value: 15, // Reduce armor by 15%
    valueType: 'percentage',
  },
  STUNNED: {
    key: 'STUNNED',
    name: 'Stunned',
    description: 'Unable to act.',
    icon: React.createElement(StopIcon, {className: "w-4 h-4 text-yellow-500"}),
    defaultDuration: 1,
    type: 'stun',
    value: 1, // Represents 1 turn of stun, value might not be strictly needed if duration is key
    valueType: 'flat',
  },
   MANA_REGEN: {
    key: 'MANA_REGEN',
    name: 'Mana Flow',
    description: 'Regenerates Mana each turn.',
    icon: React.createElement(ManaRegenIcon, {className: "w-4 h-4 text-blue-300"}),
    defaultDuration: 3,
    type: 'mana_regen',
    value: 5, // 5 mana per turn
    valueType: 'flat',
  },
};


// Define Base Skills
const crimsonBruteSkills: Skill[] = [
  { id: 'skill_cb_punch', name: 'Power Punch', description: 'A mighty blow dealing significant physical damage.', manaCost: 10, cooldown: 2, currentCooldown: 0, effectType: 'damage', effectValue: 15, target: 'enemy', icon: React.createElement(FistIcon) },
  { 
    id: 'skill_cb_iron_skin', 
    name: 'Iron Skin', 
    description: 'Temporarily hardens skin, reducing incoming damage.', 
    manaCost: 15, cooldown: 4, currentCooldown: 0, 
    effectType: 'buff_self', 
    target: 'self', 
    icon: React.createElement(DefenseIcon),
    appliesStatusEffectKey: STATUS_EFFECT_DEFINITIONS.IRON_SKIN.key,
    statusEffectDuration: STATUS_EFFECT_DEFINITIONS.IRON_SKIN.defaultDuration,
    statusEffectValue: STATUS_EFFECT_DEFINITIONS.IRON_SKIN.value, // Value from definition
  },
  {
    id: 'skill_cb_war_cry',
    name: 'War Cry',
    description: 'Lets out a ferocious cry, boosting Strength for a short duration.',
    manaCost: 12, cooldown: 5, currentCooldown: 0,
    effectType: 'buff_self',
    target: 'self',
    icon: React.createElement(TrendingUpIcon),
    appliesStatusEffectKey: STATUS_EFFECT_DEFINITIONS.STRENGTH_BUFF.key,
    statusEffectDuration: STATUS_EFFECT_DEFINITIONS.STRENGTH_BUFF.defaultDuration,
    statusEffectValue: STATUS_EFFECT_DEFINITIONS.STRENGTH_BUFF.value,
  },
];

const voidChannelerSkills: Skill[] = [
  { id: 'skill_vc_blast', name: 'Arcane Blast', description: 'Unleashes a blast of raw arcane energy. High accuracy.', manaCost: 12, cooldown: 1, currentCooldown: 0, effectType: 'damage', effectValue: 12, target: 'enemy', icon: React.createElement(SparklesIcon) },
  { 
    id: 'skill_vc_mana_shield', 
    name: 'Mana Shield', 
    description: 'Converts Mana into a temporary shield that absorbs damage.', 
    manaCost: 20, cooldown: 3, currentCooldown: 0, 
    effectType: 'shield_self', 
    target: 'self', 
    icon: React.createElement(BoltIcon),
    appliesStatusEffectKey: STATUS_EFFECT_DEFINITIONS.MANA_SHIELD.key,
    statusEffectDuration: STATUS_EFFECT_DEFINITIONS.MANA_SHIELD.defaultDuration,
    statusEffectValue: STATUS_EFFECT_DEFINITIONS.MANA_SHIELD.value, // Shield HP
  },
  {
    id: 'skill_vc_chain_lightning',
    name: 'Chain Lightning',
    description: 'Electrocutes the target, with a chance to stun.',
    manaCost: 18, cooldown: 4, currentCooldown: 0,
    effectType: 'damage', effectValue: 10, // Base damage
    target: 'enemy',
    // FIX: Use 'ManaRegenIcon' as 'LightningBoltIcon' is aliased to it in the imports.
    // Or import LightningBoltIcon separately if it's a different icon. Assuming ManaRegenIcon (which is LightningBoltIcon) is correct here.
    icon: React.createElement(ManaRegenIcon), 
    appliesStatusEffectKey: STATUS_EFFECT_DEFINITIONS.STUNNED.key, // Chance to apply stun
    statusEffectDuration: STATUS_EFFECT_DEFINITIONS.STUNNED.defaultDuration,
    // Note: Chance to apply stun would be handled in skill execution logic
  },
];

const shadowProwlerSkills: Skill[] = [
  { id: 'skill_sp_precision', name: 'Precision Shot', description: 'A carefully aimed shot with increased critical hit chance.', manaCost: 8, cooldown: 2, currentCooldown: 0, effectType: 'special_attack', effectValue: 10, target: 'enemy', icon: React.createElement(EyeIcon) }, // effectValue is base damage
  { 
    id: 'skill_sp_smoke_bomb', 
    name: 'Smoke Bomb', 
    description: 'Creates a cloud of smoke, increasing dodge chance.', 
    manaCost: 10, cooldown: 3, currentCooldown: 0, 
    effectType: 'buff_self', 
    target: 'self', 
    icon: React.createElement(WindIcon),
    appliesStatusEffectKey: STATUS_EFFECT_DEFINITIONS.SMOKE_BOMB_DODGE.key,
    statusEffectDuration: STATUS_EFFECT_DEFINITIONS.SMOKE_BOMB_DODGE.defaultDuration,
    statusEffectValue: STATUS_EFFECT_DEFINITIONS.SMOKE_BOMB_DODGE.value,
  },
  {
    id: 'skill_sp_poison_dart',
    name: 'Poison Dart',
    description: 'Fires a dart coated in venom, dealing damage over time.',
    manaCost: 15, cooldown: 3, currentCooldown: 0,
    effectType: 'damage', effectValue: 5, // Initial small impact damage
    target: 'enemy',
    icon: React.createElement(DaggerIcon), // Or a specific poison icon
    appliesStatusEffectKey: STATUS_EFFECT_DEFINITIONS.BURNING.key, // Using BURNING as a placeholder for Poison DoT
    statusEffectDuration: 3,
    statusEffectValue: 4, // 4 poison damage per turn
  },
];

// Define Base Items
export const HEALTH_POTION: GameItem = {
  id: 'item_health_potion',
  name: 'Health Potion',
  description: 'A bubbling red liquid that restores a small amount of health.',
  type: 'consumable',
  rarity: 'common',
  icon: React.createElement(HeartIcon, { className: "w-5 h-5 text-red-500" }),
  effectValue: 25, // Restores 25 HP
  quantity: 1,
  useEffect: (targetBrawler, gameContext) => {
    if (targetBrawler.currentHealth < targetBrawler.stats.maxHealth) {
      const healAmount = Math.min(HEALTH_POTION.effectValue || 0, targetBrawler.stats.maxHealth - targetBrawler.currentHealth);
      gameContext.updateBrawlerHealth(healAmount, targetBrawler.id);
      gameContext.addNarrativeLog({
        type: 'item',
        text: `${targetBrawler.name} uses a Health Potion and recovers ${healAmount} HP!`,
        icon: HEALTH_POTION.icon
      });
      return { narrativeUpdate: `${targetBrawler.name} used Health Potion.` };
    } else {
      gameContext.addNarrativeLog({
        type: 'item',
        text: `${targetBrawler.name} tries to use a Health Potion, but is already at full health.`,
        icon: HEALTH_POTION.icon
      });
      return { narrativeUpdate: `${targetBrawler.name} is at full health.` };
    }
  }
};


export const BRAWLER_CLASSES: ClassDescription[] = [
  {
    name: BrawlerClass.CRIMSON_BRUTE,
    description: "Muscular and tanky, clad in heavy cyber-armor. Favors overwhelming strength. Red/Orange visual theme.",
    primaryStat: 'strength',
    baseStats: {
      strength: [10, 15], health: [50, 60], armor: [6, 8], agility: [3, 5],
      intelligence: [1, 3], mana: [15, 25], luck: [2, 4], accuracy: [4, 6],
    },
    icon: React.createElement(FistIcon, {className: "w-8 h-8"}),
    colorGradient: "from-kaspa-red via-kaspa-orange to-red-400",
    themeColorName: "kaspa-red",
    avatarGradient: "bg-gradient-to-br from-red-500 via-kaspa-orange to-yellow-500",
    borderColorClass: "border-kaspa-red",
    shadowColorClass: "shadow-red-glow",
    skills: crimsonBruteSkills,
  },
  {
    name: BrawlerClass.VOID_CHANNELER,
    description: "Wields arcane energies, often with glowing runes or energy constructs. Blue/Violet visual theme.",
    primaryStat: 'intelligence',
    baseStats: {
      strength: [2, 4], health: [30, 40], armor: [2, 4], agility: [4, 6],
      intelligence: [10, 15], mana: [50, 70], luck: [5, 8], accuracy: [5, 7],
    },
    icon: React.createElement(SparklesIcon, {className: "w-8 h-8"}),
    colorGradient: "from-kaspa-purple via-indigo-600 to-kaspa-blue",
    themeColorName: "kaspa-purple",
    avatarGradient: "bg-gradient-to-br from-purple-600 via-kaspa-blue to-indigo-700",
    borderColorClass: "border-kaspa-purple",
    shadowColorClass: "shadow-purple-glow",
    skills: voidChannelerSkills,
  },
  {
    name: BrawlerClass.SHADOW_PROWLER,
    description: "Agile and stealthy, often hooded, utilizing advanced tech for ranged attacks. Teal/Dark Green visual theme.",
    primaryStat: 'agility',
    baseStats: {
      strength: [5, 8], health: [35, 45], armor: [3, 5], agility: [10, 15],
      intelligence: [4, 6], mana: [30, 40], luck: [6, 9], accuracy: [8, 12],
    },
    icon: React.createElement(DaggerIcon, {className: "w-8 h-8"}),
    colorGradient: "from-kaspa-teal via-cyan-600 to-kaspa-green",
    themeColorName: "kaspa-teal",
    avatarGradient: "bg-gradient-to-br from-teal-500 via-kaspa-green to-cyan-600",
    borderColorClass: "border-kaspa-teal",
    shadowColorClass: "shadow-teal-glow",
    skills: shadowProwlerSkills,
  },
];

export const ROADMAP_DATA: RoadmapStep[] = [
  { id: 1, title: "MVP LAUNCH", description: "Basic NFT minting and battle system." },
  { id: 2, title: "TOURNAMENTS", description: "Weekly tournaments with real prizes." },
  { id: 3, title: "MARKETPLACE", description: "Buy, sell and trade your brawlers." },
  { id: 4, title: "MOBILE APP", description: "Take your brawlers on the go." },
];

export const HOW_IT_WORKS_DATA: HowItWorksItem[] = [
    { id: 1, title: "MINT YOUR BRAWLER", description: "Create a unique NFT fighter with custom stats and lore. Every fighter is one of a kind.", icon: React.createElement(PlusIcon, { className: "w-12 h-12 text-kaspa-purple" }) },
    { id: 2, title: "FIGHT IN THE ARENA", description: "Send your fighter into battle. Strategy, strength, and a bit of luck will determine victory.", icon: React.createElement(CommandLineIcon, { className: "w-12 h-12 text-kaspa-pink" }) },
    { id: 3, title: "WIN & EARN GLORY", description: "Win prizes and make your name known. Climb the leaderboards and earn glory in the Kaspa universe.", icon: React.createElement(TrophyIcon, { className: "w-12 h-12 text-kaspa-teal" }) },
];

export const INITIAL_STATS: { [key in BrawlerClass]: BaseStats } = BRAWLER_CLASSES.reduce((acc, curr) => {
  acc[curr.name] = curr.baseStats;
  return acc;
}, {} as { [key in BrawlerClass]: BaseStats });


export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

export const INITIAL_LOCATIONS = ["KaspaVerse Arena Hub", "Neon Alley", "Scrapheap Market", "The Data Docks", "Forgotten Undercity Sector"];

export const STAT_DESCRIPTIONS: { [key in keyof import('./types').BrawlerStats]?: string } = {
  strength: "Raw physical power. Increases melee damage and some skill effectiveness.",
  health: "Vitality. Determines how much damage you can sustain.",
  maxHealth: "Maximum vitality.",
  armor: "Physical and energy resistance. Reduces incoming damage.",
  agility: "Nimbleness and reflexes. Affects dodge chance, initiative, and ranged/finesse skill effectiveness.",
  intelligence: "Mental acuity and tech/arcane prowess. Increases skill effectiveness, mana, and resistance to certain effects.",
  mana: "Energy pool for skills and special abilities.",
  maxMana: "Maximum energy pool.",
  luck: "Chance and fortune. Influences critical hits, loot drops, and favorable outcomes in random events.",
  accuracy: "Precision in combat. Affects hit chance for attacks and abilities, countered by opponent's Agility/Dodge.",
};
