#!/usr/bin/env node

/**
 * Vue TSOA MongoDB Template Setup Script
 * 
 * This script helps you customize the template with your project name.
 * It will:
 * 1. Prompt for your project name
 * 2. Update all references from "vue-tsoa-mongodb-template" to your project name
 * 3. Update package.json files, README files, and configuration
 * 4. Suggest to delete this setup script when done
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function validateProjectName(name) {
  // Check if name is valid for npm package names
  const npmNameRegex = /^[a-z0-9]([a-z0-9\-_])*$/;
  
  if (!name || name.trim().length === 0) {
    return 'Project name cannot be empty';
  }
  
  const trimmedName = name.trim().toLowerCase();
  
  if (!npmNameRegex.test(trimmedName)) {
    return 'Project name must contain only lowercase letters, numbers, hyphens, and underscores, and start with a letter or number';
  }
  
  if (trimmedName.length > 50) {
    return 'Project name must be 50 characters or less';
  }
  
  return null;
}

function replaceInFile(filePath, searchValue, replaceValue) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(new RegExp(searchValue, 'g'), replaceValue);
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    log(`Error updating ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function updateProjectFiles(projectName, projectDisplayName, projectTagLine, leadDeveloperName, leadDeveloperEmail) {
  const rootDir = path.resolve(__dirname, '..');
  const updates = [];
  
  log('\n📝 Updating project files...', 'cyan');
  
  // Files to update with their relative paths
  const filesToUpdate = [
    // Root files
    "package.json",
    "README.md",

    // Backend files
    "backend/package.json",
    "backend/README.md",
    "backend/.env.template",
    "backend/tsoa.json",

    // Frontend files
    "frontend/package.json",
    "frontend/README.md",
    "frontend/src/components/AdminLogin/AdminLogin.vue",
    "frontend/.gitignore",
    "frontend/tsconfig.app.json",
    "frontend/vite.config.ts",
    "frontend/src/core/http.ts",
    "frontend/src/components/AdminLogin/AdminLogin.vue",
    "frontend/src/components/AdminLogin/AdminLogin.test.ts",

    // Docker compose files
    "etc/docker-compose.db.yml",
    "etc/docker-compose.dev.yml",
    "etc/docker-compose.prod.yml",
    "etc/docker-compose.test.yml",
  ];
  
  // Update template name references
  filesToUpdate.forEach(file => {
    const filePath = path.join(rootDir, file);
    let updated = false;
    
    // Replace package names
    if (replaceInFile(filePath, 'vue-tsoa-mongodb-template', projectName)) {
      updated = true;
    }
    
    // Replace API references
    if (replaceInFile(filePath, 'vue-tsoa-mongodb-template-api', `${projectName}-api`)) {
      updated = true;
    }
    
    // Replace display names in README and descriptions
    if (replaceInFile(filePath, 'Vue TSOA MongoDB Template', projectDisplayName)) {
      updated = true;
    }
    
    // Replace tag line
    if (replaceInFile(filePath, 'A Vue TSOA MongoDB Application', projectTagLine)) {
      updated = true;
    }

    if (leadDeveloperName) {
      if (replaceInFile(filePath, 'Lead Developer', leadDeveloperName)) {
        updated = true;
      }
    }
    
    if (leadDeveloperEmail) {
      if (replaceInFile(filePath, 'lead.developer@example.com', leadDeveloperEmail)) {
        updated = true;
      }
    }

    if (updated) {
      updates.push(file);
      log(`  ✓ Updated ${file}`, 'green');
    }
  });
  
  // Rename the API directory in frontend
  const oldApiDir = path.join(rootDir, 'frontend/src/core/vue-tsoa-mongodb-template-api');
  const newApiDir = path.join(rootDir, `frontend/src/core/${projectName}-api`);
  
  if (fs.existsSync(oldApiDir)) {
    try {
      fs.renameSync(oldApiDir, newApiDir);
      updates.push(`frontend/src/core/${projectName}-api (renamed directory)`);
      log(`  ✓ Renamed API directory to ${projectName}-api`, 'green');
    } catch (error) {
      log(`  ⚠ Could not rename API directory: ${error.message}`, 'yellow');
    }
  }
  
  return updates;
}

function runNpmScripts() {
  const { execSync } = require('child_process');
  const rootDir = path.resolve(__dirname, '..');
  const updates = [];
    log('\n⚙️  Running npm install in backend and frontend...', 'cyan');

    try {
        execSync('npm install', { cwd: path.join(rootDir, 'backend'), stdio: 'inherit' });
        updates.push('backend (npm install)');
    } catch (error) {
        log(`  ⚠ Could not run npm install in backend: ${error.message}`, 'yellow');
    }

    try {
        execSync('npm install', { cwd: path.join(rootDir, 'frontend'), stdio: 'inherit' });
        updates.push('frontend (npm install)');
    } catch (error) {
        log(`  ⚠ Could not run npm install in frontend: ${error.message}`, 'yellow');
    }

    log("\n⚙️  Running npm build in backend ...", "cyan");
    try {
        execSync('npm run build', { cwd: path.join(rootDir, 'backend'), stdio: 'inherit' });
        updates.push('backend (npm run build)');
    } catch (error) {
        log(`  ⚠ Could not run npm run build in backend: ${error.message}`, 'yellow');
    }

    log("\n⚙️  Running npx api gen in frontend ...", "cyan");
    try {
        execSync('npm run api-sdk-gen', { cwd: path.join(rootDir, 'frontend'), stdio: 'inherit' });
        updates.push('frontend (npx api gen)');
    } catch (error) {
        log(
          `  ⚠ Could not run npm run api-sdk-gen in frontend: ${error.message}`,
          "yellow"
        );
    }

  return updates;
}

function showCompletionMessage(projectName, projectDisplayName, updates) {
  log('\n🎉 Setup Complete!', 'green');
  log('================', 'green');
  
  log(`\n✅ Successfully updated ${updates.length} files and directories`, 'bright');
  log(`📦 Project name: ${projectName}`, 'cyan');
  log(`📋 Display name: ${projectDisplayName}`, 'cyan');
  
  log('\n📁 Updated files:', 'bright');
  updates.forEach(file => {
    log(`   • ${file}`, 'blue');
  });
  
  log('\n🚀 Next Steps:', 'bright');
  log('   1. Set up .env files:', 'white');
  log('   2. Start development:', 'white');
  log('      npm run dev', 'cyan');
  log('   3. Delete this setup script:', 'white');
  log('      rm etc/setup.js', 'cyan');
  log('      (or: Remove-Item etc/setup.js  # on Windows)', 'cyan');
  
  log('\n📖 See README.md for detailed setup instructions', 'yellow');
  log('\n🗑️  You can safely delete this setup script now!', 'magenta');
}

async function promptProjectName() {
  return new Promise((resolve) => {
    rl.question('Enter your project name (lowercase, letters/numbers/hyphens only): ', (answer) => {
      const validation = validateProjectName(answer);
      if (validation) {
        log(`❌ ${validation}`, 'red');
        resolve(promptProjectName()); // Ask again
      } else {
        resolve(answer.trim().toLowerCase());
      }
    });
  });
}

async function promptDisplayName(projectName) {
  return new Promise((resolve) => {
    const defaultDisplayName = projectName
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    rl.question(`Enter display name for your project (default: "${defaultDisplayName}"): `, (answer) => {
      resolve(answer.trim() || defaultDisplayName);
    });
  });
}

async function promptTagLine(projectName) {
  return new Promise((resolve) => {
    const defaultTagLine = `${projectName} - A Vue TSOA MongoDB Application`;

    rl.question(
      `Enter tag line for your project (default: "${defaultTagLine}"): `,
      (answer) => {
        resolve(answer.trim() || defaultTagLine);
      }
    );
  });
}

async function promptLeadDeveloperName() {
  return new Promise((resolve) => {
    rl.question('Enter lead developer name (optional): ', (answer) => {
      resolve(answer.trim());
    });
  });
}

async function promptLeadDeveloperEmail() {
  return new Promise((resolve) => {
    rl.question('Enter lead developer email (optional): ', (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  log('🚀 Vue TSOA MongoDB Template Setup', 'bright');
  log('=====================================', 'bright');
  log('This script will help you customize the template with your project name.\n', 'white');
  
  try {
    // Get project name
    const projectName = await promptProjectName();
    
    // Get display name
    const projectDisplayName = await promptDisplayName(projectName);

    // Get tag line
    const projectTagLine = await promptTagLine(projectName);

    // Get lead developer name
    const leadDeveloperName = await promptLeadDeveloperName();

    // Get lead developer email
    const leadDeveloperEmail = await promptLeadDeveloperEmail();

    // Confirm settings
    log('\n📋 Configuration:', 'bright');
    log(`   Project name: ${projectName}`, 'cyan');
    log(`   Display name: ${projectDisplayName}`, 'cyan');
    log(`   Tag line: ${projectTagLine}`, 'cyan');
    log(`   Lead developer name: ${leadDeveloperName}`, 'cyan');
    log(`   Lead developer email: ${leadDeveloperEmail}`, 'cyan');

    const shouldContinue = await new Promise((resolve) => {
      rl.question('\nContinue with setup? (y/N): ', (answer) => {
        resolve(answer.toLowerCase().startsWith('y'));
      });
    });
    
    if (!shouldContinue) {
      log('Setup cancelled.', 'yellow');
      rl.close();
      return;
    }
    
    // Update files
    const updates = updateProjectFiles(projectName, projectDisplayName, projectTagLine, leadDeveloperName, leadDeveloperEmail);
    
    updates.push(runNpmScripts());

    // Show completion message
    showCompletionMessage(projectName, projectDisplayName, updates);
    
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Check if Node.js
if (typeof require === 'undefined') {
  console.log('❌ This script requires Node.js to run.');
  console.log('Please install Node.js from https://nodejs.org/');
  process.exit(1);
}

// Run the script
main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});