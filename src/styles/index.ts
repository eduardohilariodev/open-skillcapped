/**
 * Styles Index
 * This file exports all styling components and variables
 */

// Import base styling
import "./fonts.css";
import "./bulma-overrides.css";

// Export color variables
import colors from "./colors";
export { colors };

// Export typography variables
import typography from "./typography";
export { typography };

// Export spacing variables
import spacing from "./spacing";
export { spacing };

// Export component style functions
import components from "./components";
export { components };

// Export tone and voice guidelines
import toneAndVoice from "./toneAndVoice";
export { toneAndVoice };

// Export theme helpers
import leagueify from "./theme";
export { leagueify };

// Import and export Hextech design system
import "./hextech-global.css";
import "./hextech-magic.css";
import "./hextech-animations.css";
import hextech, {
  addHextechParticles,
  addHextechEnergyLines,
  addHextechShimmer,
  applyHextechEffects,
} from "./hextech-index";

// Export Hextech components
export { hextech, addHextechParticles, addHextechEnergyLines, addHextechShimmer, applyHextechEffects };

// Export Hextech shapes
export { HextechSquare, HextechDiamond, HextechCircle, HextechCorner } from "./components/hextech-shapes";

// Export frame component
export { default as HextechFrame } from "../components/HextechFrame";
