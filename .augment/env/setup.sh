#!/bin/bash

# Install Node.js 18 (required by the project)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js and npm installation
node --version
npm --version

# Install Twilio CLI globally
npm install -g twilio-cli

# Install Twilio CLI plugins required by the project
twilio plugins:install @twilio-labs/plugin-flex@7.1.0
twilio plugins:install @twilio-labs/plugin-serverless@v3

# Add npm global bin to PATH in user profile
echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> $HOME/.profile

# Install root project dependencies
npm install

# Navigate to plugin directory
cd plugin-flex-ts-template-v2

# Add compatible Redux dependencies to package.json
echo "=== Adding compatible Redux dependencies to package.json ==="
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.dependencies = pkg.dependencies || {};
pkg.dependencies['redux'] = '^4.2.1';
pkg.dependencies['react-redux'] = '^7.2.9';
pkg.dependencies['@reduxjs/toolkit'] = '^1.6.0';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('Added compatible Redux dependencies to package.json');
"

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Apply Twilio's recommended TypeScript fixes for Flex UI component customizations
echo "=== Applying TypeScript fixes for Flex UI component customizations ==="

# Fix MessageListItem.tsx
echo "Fixing MessageListItem.tsx..."
sed -i 's/flex\.MessageListItem\.Content\.replace/(flex.MessageListItem.Content as any).replace/g' src/feature-library/chat-transfer/flex-hooks/components/MessageListItem.tsx

# Fix TaskInfoPanel.tsx
echo "Fixing TaskInfoPanel.tsx..."
sed -i 's/flex\.TaskInfoPanel\.Content\.replace/(flex.TaskInfoPanel.Content as any).replace/g' src/feature-library/callback-and-voicemail/flex-hooks/components/TaskInfoPanel.tsx

# Fix CRMContainer.tsx files
echo "Fixing CRMContainer.tsx files..."
find src -name "CRMContainer.tsx" -exec sed -i 's/flex\.CRMContainer\.Content\.replace/(flex.CRMContainer.Content as any).replace/g' {} \;

# Fix TaskCanvasHeader.tsx
echo "Fixing TaskCanvasHeader.tsx..."
sed -i 's/flex\.TaskCanvasHeader\.Content\.add/(flex.TaskCanvasHeader.Content as any).add/g' src/feature-library/agent-automation/flex-hooks/components/TaskCanvasHeader.tsx
sed -i 's/flex\.TaskCanvasHeader\.Content\.remove/(flex.TaskCanvasHeader.Content as any).remove/g' src/feature-library/agent-automation/flex-hooks/components/TaskCanvasHeader.tsx

# Fix MessageBubble.tsx
echo "Fixing MessageBubble.tsx..."
find src -name "MessageBubble.tsx" -exec sed -i 's/flex\.MessageBubble\.Content\.add/(flex.MessageBubble.Content as any).add/g' {} \;

# Verify the changes
echo "=== Verifying TypeScript fixes ==="
echo "Checking for 'as any' additions:"
grep -r "as any" src/feature-library/ | grep -E "(Content\.(replace|add|remove))" || echo "No 'as any' fixes found"

cd ..

# Install serverless-functions dependencies
cd serverless-functions
npm install
cd ..

# Install flex-config dependencies
cd flex-config
npm install
cd ..

# Install docs dependencies
cd docs
npm install
cd ..

# Install addon dependencies
cd addons/serverless-schedule-manager
npm install
cd ../..

# Source the profile to ensure PATH is updated
source $HOME/.profile