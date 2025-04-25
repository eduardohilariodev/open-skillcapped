const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing dependencies for the React app...');

// Run npm install to install dependencies and dev dependencies
try {
  console.log('Running npm install...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}

// Create any missing directories
const dirsToCreate = [
  'public',
  'src/renderer/components/omnisearch',
  'src/renderer/components/modal',
];

dirsToCreate.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

console.log('Setup completed successfully!'); 
