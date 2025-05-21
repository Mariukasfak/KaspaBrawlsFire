

export enum BrawlerClass {
  CRIMSON_BRUTE = 'Crimson Brute', // Fighter
  VOID_CHANNELER = 'Void Channeler', // Mage
  SHADOW_PROWLER = 'Shadow Prowler', // Archer
}

export enum ArenaTier {
  RUSTED_CIRCUIT = 'Rusted Circuit',
  BRONZE_LEAGUE = 'Bronze League',
  SILVER_DATASTREAM = 'Silver Datastream',
  GOLD_PROTOCOL = 'Gold Protocol',
  CYBERNETIC_LEGEND = 'Cybernetic Legend',
  VOID_MASTER = 'Void Master',
}

export interface BaseStats {
  strength: [number, number];
  health: [number, number];
  armor: [number, number];
  agility: [number, number];
  intelligence: [number, number];
  mana: [number, number];
  luck: [number, number];
  accuracy: [number, number];
}

export interface BrawlerStats {
  strength: number;
  health: number; // Base max health
  maxHealth: number; // Current max health (can be modified by buffs/gear)
  armor: number;
  agility: number;
  intelligence: number;
  mana: number; // Base max mana
  maxMana: number; // Current max mana
  luck: number;
  accuracy: number;
}

export interface CombatStatus {
  isDefending: boolean;
  isDodging: boolean;
  turnsUntilSpecialReady?: number; 
  isStunned?: boolean; // Added for stun status
}

export interface ShieldDetails {
  currentValue: number;
  maxValue: number;
}

// New StatusEffect Interface
export interface StatusEffect {
  id: string; // Unique instance ID of the applied effect
  key: string; // Key to look up definition in STATUS_EFFECT_DEFINITIONS
  sourceSkillId?: string; // Skill that applied this effect (ID of the skill)
  appliedBySkillId?: string; // ID of the skill that applied this status effect instance.
  name: string; // e.g., "Shielded", "Burning", "Quickened"
  description: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  duration: number; // Turns remaining
  // More specific effect types
  type: 'damage_reduction' | 'damage_over_time' | 'dodge_increase' | 'accuracy_increase' | 
        'stat_buff' | 'stat_debuff' | 'stun' | 'heal_over_time' | 'absorb_shield' | 'mana_regen';
  value: number; // e.g., 20 for 20% DR, 5 for 5 damage per turn, 10 for +10 STR
  valueType?: 'percentage' | 'flat'; // How 'value' should be interpreted for buffs/debuffs
  statAffected?: keyof BrawlerStats; // Which stat is affected by stat_buff/stat_debuff
  tickOnApplication?: boolean; // Does DoT/HoT apply its effect immediately on application?
  appliedTurn?: number; // Game turn when it was applied
  shieldDetails?: ShieldDetails; // Details for absorb_shield type
}


// New Skill Interface
export interface Skill {
  id: string;
  name:string;
  description: string;
  manaCost: number;
  cooldown: number; // Total turns for cooldown
  currentCooldown: number; // Turns remaining until usable
  effectType: 'damage' | 'heal' | 'buff_self' | 'buff_target' | 'debuff_target' | 'special_attack' | 'shield_self' | 'utility';
  effectValue?: number; // e.g., damage amount, heal amount, buff percentage or flat value
  target: 'self' | 'enemy' | 'none'; // 'none' for skills that don't directly target, e.g. self-buffs where target is implicit
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  appliesStatusEffectKey?: string; // Key of the StatusEffectDefinition it applies
  statusEffectDuration?: number; // Duration for the applied status effect
  statusEffectValue?: number; // Value for the applied status effect (if it overrides definition)
}


export interface Brawler {
  id: string;
  name: string;
  brawlerClass: BrawlerClass;
  stats: BrawlerStats;
  currentHealth: number; // Actual health in battle
  currentMana: number;   // Actual mana in battle
  lore: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  combatStatus: CombatStatus;
  skills: Skill[]; // Brawler's available skills
  activeStatusEffects: StatusEffect[]; // Status effects currently affecting the brawler
  items: GameItem[]; // Consumable items, etc.
  arenaPoints: number;
  currentArenaTier: ArenaTier;
}

export interface GameItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'trinket' | 'consumable';
  description: string;
  statBonuses?: Partial<BrawlerStats>;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>; 
  useEffect?: (target: Brawler, gameContext: any) => ActionResult | void; // For consumables or equippables, can return ActionResult for log updates
  manaCost?: number;
  cooldown?: number; // For items with cooldowns
  currentCooldown?: number;
  quantity?: number; // For stackable items
  effectValue?: number; // e.g. health restored by potion
}

export interface WalletState {
  isWalletConnected: boolean;
  kasAddress: string | null;
  kasBalance: number | null;
}

export interface BattleSummary {
  id: string;
  opponentName: string;
  opponentClass: BrawlerClass;
  result: 'win' | 'loss';
  timestamp: number;
  xpGained?: number;
  tokensGained?: number;
  arenaPointsChange?: number;
}

export interface GameState extends WalletState {
  currentBrawler: Brawler | null;
  currentLocation: string;
  narrativeLog: NarrativeLogEntry[];
  currentEvent: NarrativeEvent | null;
  isLoading: boolean;
  brawlTokens: number;
  inventory: GameItem[]; // This is player's global inventory, brawler.items is for in-battle
  isBattleActive: boolean;
  opponent: Brawler | null; 
  battleHistory: BattleSummary[];
  turnNumber: number; // For auto-battle turn tracking
  isAutoBattling: boolean; // Flag to indicate auto-battle is in progress
}

export interface NarrativeLogEntry {
  id: string;
  text: string;
  type: 'narrative' | 'combat' | 'reward' | 'system' | 'error' | 'wallet' | 'skill' | 'item' | 'status'; // Added 'status' type
  timestamp: number;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

export interface NarrativeEvent {
  id: string;
  title: string;
  description: string;
  choices: NarrativeChoice[];
  imageUrl?: string; 
}

export interface NarrativeChoice {
  text: string;
  actionKey: string; 
}

export type CombatActionType = 'attack' | 'defend' | 'dodge' | 'skill' | 'item' | 'flee';

export interface CombatAction {
  actorId: string; // Brawler ID performing action
  type: CombatActionType;
  targetId?: string; // Brawler ID being targeted
  skillId?: string; // If action type is 'skill'
  itemId?: string; // If action type is 'item'
}

export interface CombatOutcome {
  attackerId?: string; // ID of the brawler who initiated the action leading to this outcome
  text: string; // Descriptive text of what happened
  damageDealt?: number;
  healthRecovered?: number;
  manaUsed?: number;
  targetStatusChange?: Partial<CombatStatus>; // Old, might deprecate for activeStatusEffects
  actorStatusChange?: Partial<CombatStatus>; // Old, might deprecate
  isHit?: boolean;
  isCritical?: boolean;
  criticalDamageBonus?: number; // Store the bonus damage from critical
  isDodged?: boolean;
  effectIcon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  skillUsed?: Skill['id'];
  itemUsed?: GameItem['id'];
  statusApplied?: StatusEffect; // The status effect object that was applied
  targetStatusEffectsUpdated?: StatusEffect[]; // Full list of target's status effects after action
  actorStatusEffectsUpdated?: StatusEffect[]; // Full list of actor's status effects after action
}


export interface ActionResult {
  narrativeUpdate: string;
  statChanges?: Partial<BrawlerStats>; 
  tokensGained?: number;
  itemFound?: GameItem;
  startCombat?: boolean; 
  opponentToFight?: Brawler; 
  nextEventId?: string; 
  hpChange?: {targetId: string, amount: number}; // More specific HP change
  manaChange?: {targetId: string, amount: number}; // More specific Mana change
  combatOutcome?: CombatOutcome[]; // For detailed combat round results
}

export interface StatusEffectDefinition extends Omit<StatusEffect, 'id' | 'duration' | 'appliedTurn' | 'key' | 'sourceSkillId' | 'appliedBySkillId' | 'shieldDetails'> {
  key: string; // Unique key for this definition
  defaultDuration: number;
  // value, valueType, statAffected are part of the base StatusEffect but defined here as defaults
}


export interface ClassDescription {
  name: BrawlerClass;
  description: string;
  baseStats: BaseStats; 
  primaryStat: keyof BrawlerStats;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; 
  colorGradient: string; // For UI elements like buttons or backgrounds
  themeColorName: 'kaspa-red' | 'kaspa-orange' | 'kaspa-pink' | 'kaspa-purple' | 'kaspa-blue' | 'kaspa-teal' | 'kaspa-green'; // Tailwind color name
  avatarGradient: string; // Specific gradient for the avatar background
  borderColorClass: string; // e.g. border-kaspa-red
  shadowColorClass: string; // e.g. shadow-red-glow
  skills: Skill[]; // Base skills for this class
}

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
}

export interface HowItWorksItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface CombatEffect {
  id: string;
  type: 'damage' | 'heal' | 'status' | 'text_indicator' | 'critical_indicator' | 'mana_gain' | 'mana_loss';
  value?: string | number;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  targetId: string; // ID of the brawler the effect is on
  position?: { x: number; y: number }; // For visual positioning
  duration?: number; // ms, for how long the visual effect lasts
  isCritical?: boolean; // Added for styling critical damage differently
}
