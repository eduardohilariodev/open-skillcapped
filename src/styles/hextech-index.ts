/**
 * League of Legends Hextech Design System
 * This file provides a centralized import for all Hextech design elements
 */

// Import all Hextech components and styles
import "./hextech-global.css";
import "./hextech-magic.css";
import "./hextech-animations.css";

// Export shape components
export * from "./components/hextech-shapes";

// Utility function to add Hextech particle effects to an element
export const addHextechParticles = (element: HTMLElement, count = 5, color = "#0AC8B9") => {
  // Create particle container
  const container = document.createElement("div");
  container.className = "hextech-particles";
  element.appendChild(container);

  // Create particles
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "hextech-particle";

    // Random position and size
    const size = Math.floor(Math.random() * 10) + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = "0";

    // Random animation duration and delay
    const duration = Math.random() * 2 + 2;
    const delay = Math.random() * 5;
    particle.style.animation = `float ${duration}s ease-in-out infinite`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);
  }
};

// Utility function to add Hextech energy lines
export const addHextechEnergyLines = (element: HTMLElement) => {
  const energyLines = document.createElement("div");
  energyLines.className = "hextech-energy-lines";
  element.appendChild(energyLines);
};

// Utility to apply Hextech shimmer effect
export const addHextechShimmer = (element: HTMLElement) => {
  element.classList.add("hextech-shimmer");
};

// Utility to batch apply Hextech effects to elements
export const applyHextechEffects = (
  selector: string,
  options = { particles: true, energyLines: false, shimmer: false },
) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    if (options.particles) {
      addHextechParticles(el as HTMLElement);
    }
    if (options.energyLines) {
      addHextechEnergyLines(el as HTMLElement);
    }
    if (options.shimmer) {
      addHextechShimmer(el as HTMLElement);
    }
  });
};

// Export default with all functions
export default {
  addHextechParticles,
  addHextechEnergyLines,
  addHextechShimmer,
  applyHextechEffects,
};
