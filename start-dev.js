const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Start Vite dev server
const vite = spawn("npm", ["run", "vite:dev"], {
  stdio: "inherit",
  shell: true,
});

// Wait a bit for Vite to start (optional, but can help)
// setTimeout(() => {
// Start Electron
const electron = spawn("npm", ["start"], {
  stdio: "inherit",
  shell: true,
});
// }, 5000); // Adjust delay as needed

// Handle process termination
process.on("SIGINT", () => {
  vite.kill();
  electron.kill();
  process.exit();
});

console.log("Development mode started. Press Ctrl+C to stop.");
