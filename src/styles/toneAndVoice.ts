/**
 * League of Legends Tone and Voice Guidelines
 * Based on: https://brand.riotgames.com/en-us/league-of-legends/tone-and-voice
 */

export const toneAndVoice = {
  // Core principles
  principles: {
    clear: "Be direct and straightforward in communication",
    authentic: "Stay true to the League of Legends brand and lore",
    respectful: "Treat players with respect and consideration",
    player_focused: "Keep the player experience at the center of all messaging",
    confident: "Communicate with authority but without arrogance",
  },

  // Writing style
  style: {
    // Maintain the epic fantasy feel of League of Legends
    fantasy: "Use language that reflects the epic fantasy world of Runeterra",

    // Be bold and confident, but not arrogant
    bold: "Use strong, impactful language that inspires action",

    // Be concise and clear
    concise: "Avoid unnecessary words and get to the point quickly",

    // Use active voice
    active: "Prefer active voice over passive voice",

    // Be inclusive
    inclusive: "Use language that welcomes all players",
  },

  // Terminology examples
  terminology: {
    champions: 'Always refer to playable characters as "champions"',
    abilities: 'Use specific ability names when possible (e.g., "Demacian Justice" instead of "Garen\'s ultimate")',
    gameplay: {
      lane: "Top, Mid, Bot/Bottom, Jungle, Support",
      roles: "Tank, Fighter, Mage, Assassin, Marksman, Support",
      objectives: "Baron Nashor, Dragon, Herald, Towers, Inhibitors",
    },
  },

  // Example phrases and alternatives
  examples: {
    avoid: [
      "You died because you made a mistake",
      "This champion is overpowered",
      "You lost because your team was bad",
    ],
    prefer: [
      "Here's an opportunity to improve your positioning",
      "This champion excels in these situations",
      "Here's a strategy that might help your team coordinate better",
    ],
  },
};

export default toneAndVoice;
