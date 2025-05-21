
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';
import { BrawlerClass, BrawlerStats, ClassDescription } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set. Gemini functionality will be disabled.");
}
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;


export const generateBrawlerLore = async (name: string, brawlerClass: BrawlerClass): Promise<string> => {
  if (!ai) return "A mysterious past, shrouded in the digital fog of KaspaVerse...";
  try {
    const prompt = `Generate a short, gritty, cyber-fantasy backstory (around 50-70 words) for a Kaspa Brawler named "${name}", who is a ${brawlerClass}. The setting is KaspaVerse, a neon-drenched city of conflict and opportunity. Make it sound like an NFT character description.`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: [{ role: "user", parts: [{text: prompt}] }],
       config: { temperature: 0.8, topP:0.9, topK:40 }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating brawler lore:", error);
    return "Born in the digital shadows, fighting for a byte of glory.";
  }
};

export const generateNarrativeEventDescription = async (brawlerName: string, brawlerClass: BrawlerClass, location: string): Promise<string> => {
  if (!ai) return `You are at ${location}. The air is thick with digital static. What do you do?`;
  try {
    const prompt = `You are ${brawlerName}, a ${brawlerClass}, currently in ${location} within KaspaVerse. Describe a brief, intriguing situation or encounter (2-3 sentences). This is for a text adventure game. Include a hint of danger or opportunity. Example: "A cloaked figure in a dark alley beckons you closer, a data-chip glinting." or "A holographic WANTED poster flickers, displaying a familiar face and a hefty BRAWL token reward."`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: [{ role: "user", parts: [{text: prompt}] }],
        config: { temperature: 0.7, topP:0.95, topK:50 }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating narrative event:", error);
    return `An eerie silence falls over ${location}. You feel like you're being watched.`;
  }
};


export const generateChoicesForEvent = async (eventDescription: string, brawlerClass: BrawlerClass, brawlerStats: BrawlerStats): Promise<string[]> => {
    if (!ai) return ["Investigate further.", "Ignore and move on.", "Prepare for a fight."];
    try {
        const prompt = `Given the situation: "${eventDescription}" for a ${brawlerClass} brawler with stats (STR: ${brawlerStats.strength}, AGI: ${brawlerStats.agility}, INT: ${brawlerStats.intelligence}, LCK: ${brawlerStats.luck}).
        Generate 3 distinct, concise action choices (max 6 words each).
        Choices should be actionable and relevant. One choice could be related to the brawler's class or a high stat.
        Format as a JSON array of strings. Example: ["Attack the figure", "Attempt to sneak past", "Offer credits for info"]`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL_TEXT,
            contents: [{ role: "user", parts: [{text: prompt}] }],
            config: { responseMimeType: "application/json", temperature: 0.6, topP:0.9, topK:40 }
        });
        
        let jsonStr = response.text.trim();
        // Using new RegExp for fenceRegex to avoid potential issues with literal parsing.
        // The original regex was: /^\`\`\`(\w*)?\s*\n?(.*?)\n?\s*\`\`\`$/s
        const fenceRegexPattern = "^\\`\\`\\`(\\w*)?\\s*\\n?(.*?)\\n?\\s*\\`\\`\\`$";
        const fenceRegex = new RegExp(fenceRegexPattern, "s");
        
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        try {
            const parsedChoices = JSON.parse(jsonStr);
            if (Array.isArray(parsedChoices) && parsedChoices.every(c => typeof c === 'string') && parsedChoices.length > 0 && parsedChoices.length <= 4) {
                return parsedChoices.slice(0,3); 
            }
        } catch (e) {
            console.error("Failed to parse choices JSON:", e, "Raw:", jsonStr);
        }
        return ["Assess the situation.", "Use a class ability.", "Proceed with caution."];

    } catch (error) {
        console.error("Error generating choices:", error);
        return ["Look around.", "Stay alert.", "Move carefully."];
    }
};

export const generateCombatActionText = async (
    attackerName: string, 
    attackerClass: BrawlerClass, 
    defenderName: string, 
    actionType: string, // "attack", "defend", "dodge", "special_move", etc.
    success: boolean, 
    damage?: number,
    details?: string // e.g. "dodged", "partially blocked", "CRITICAL HIT!"
  ): Promise<string> => {
  if (!ai) {
    let message = "";
    if (actionType === 'defend') message = `${attackerName} braces for impact!`;
    else if (actionType === 'dodge') message = success ? `${attackerName} nimbly avoids the blow!` : `${attackerName} attempts to dodge but fails!`;
    else if (success) {
        message = `${attackerName} ${details?.includes("CRITICAL HIT!") ? 'lands a CRITICAL HIT on' : 'hits'} ${defenderName} for ${damage} damage!`;
        if (details && !details.includes("CRITICAL HIT!")) message += ` ${details}.`;
    } else {
        message = `${attackerName} misses ${defenderName}. ${details || ''}`;
    }
    return message;
  }
  try {
    let prompt = `Generate a short, flavorful combat description (1 sentence) for a text adventure.
Attacker: ${attackerName} (${attackerClass})
Defender: ${defenderName}
Action Type: ${actionType} (e.g. 'powerful strike', 'energy blast', 'quick jab', 'defensive stance', 'evasive maneuver')
Outcome: ${success ? 'Success/Hit' : 'Failure/Miss'}`;

    if (damage !== undefined && damage > 0 && success) {
      prompt += `\nDamage Dealt: ${damage}`;
    }
    if (details) { // This 'details' can include "CRITICAL HIT!", "Defended", "Dodged by opponent" etc.
      prompt += `\nAdditional Details: ${details}`;
    }

    prompt += `\n\nConsider the details when crafting the sentence.
Examples:
- Action: 'powerful strike', Hit, Damage: 15, Details: 'CRITICAL HIT!': "${attackerName} unleashes a devastating blow, a CRITICAL HIT smashing into ${defenderName} for 15 damage!"
- Action: 'plasma shot', Hit, Damage: 10, Details: '(Defended)': "${attackerName}'s plasma shot connects, but ${defenderName}'s defenses reduce the impact to 10 damage."
- Action: 'quick jab', Miss, Details: 'Missed!': "${defenderName} sidesteps ${attackerName}'s quick jab with ease."
- Action: 'defensive stance': "${attackerName} raises their cyber-shield, anticipating the enemy's move."
- Action: 'evasive maneuver', Success (meaning player successfully initiated dodge state): "${attackerName} becomes a blur, ready to evade the next attack."
- Action: 'attack attempt', Fail (meaning player's attack was dodged by opponent): "${attackerName}'s lunge is expertly dodged by ${defenderName}!"`;


    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: [{ role: "user", parts: [{text: prompt}] }],
        config: { temperature: 0.65, topP: 0.95, topK: 40 }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating combat text:", error);
    if (actionType === 'defend') return `${attackerName} takes a defensive stance.`;
    if (actionType === 'dodge') return success ? `${attackerName} successfully prepares to dodge!` : `${attackerName} fails to prepare to dodge.`;
    let message = success ? `${attackerName}'s ${actionType} connects!` : `${attackerName}'s ${actionType} fails!`;
    if(details) message += ` ${details}`;
    return message;
  }
};

export const generateItemDescription = async (itemName: string, itemType: string, rarity: string): Promise<string> => {
  if (!ai) return `A ${rarity} ${itemType}. Seems useful.`;
  try {
    const prompt = `Generate a short, flavorful description (1-2 sentences) for a ${rarity} ${itemType} called "${itemName}" found in the cyber-fantasy world of KaspaVerse. Example: "This 'Neuro-Linked Visor' hums with latent energy, promising enhanced targeting data."`;
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: [{ role: "user", parts: [{text: prompt}] }],
        config: { temperature: 0.7 }
    });
    return response.text.trim();
  } catch(error) {
    console.error("Error generating item description:", error);
    return `This ${itemName} looks like it has seen some action.`;
  }
}
