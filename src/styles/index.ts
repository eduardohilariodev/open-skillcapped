/**
 * League of Legends Style Guide
 * Based on:
 * - https://brand.riotgames.com/en-us/league-of-legends/fundamentals
 * - https://brand.riotgames.com/en-us/league-of-legends/typography
 * - https://brand.riotgames.com/en-us/league-of-legends/color
 * - https://brand.riotgames.com/en-us/league-of-legends/tone-and-voice
 */

// Import all style modules
import colors from "./colors";
import typography from "./typography";
import spacing from "./spacing";
import components from "./components";
import toneAndVoice from "./toneAndVoice";

// Import CSS styles
import "./fonts.css";

// Export individual modules
export { colors, typography, spacing, components, toneAndVoice };

// Export default object with all style guide components
const styleGuide = {
  colors,
  typography,
  spacing,
  components,
  toneAndVoice,
};

export default styleGuide;
