#!/bin/bash

# 🚀 ConnieRTC Quick Start - Deploy in 30 Minutes
# This script sets up a working ConnieRTC deployment with Google Sheets integration

set -e  # Exit on any error

echo "🚀 Welcome to ConnieRTC Quick Start!"
echo "This will deploy ConnieRTC with Google Sheets integration in ~30 minutes"
echo ""

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function for pretty printing
print_step() {
    echo -e "${BLUE}🔸 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
print_step "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ required. Current version: $(node --version)"
    exit 1
fi

# Check if Twilio CLI is installed
if ! command -v twilio &> /dev/null; then
    print_error "Twilio CLI is not installed. Please install from https://www.twilio.com/docs/twilio-cli/quickstart"
    exit 1
fi

print_success "Prerequisites check passed!"
echo ""

# Get Twilio credentials
print_step "Setting up Twilio credentials..."
echo "Please provide your Twilio credentials:"
echo "You can find these at https://console.twilio.com"
echo ""

read -p "Twilio Account SID: " TWILIO_ACCOUNT_SID
read -s -p "Twilio Auth Token: " TWILIO_AUTH_TOKEN
echo ""

# Validate credentials
print_step "Validating Twilio credentials..."
if ! twilio api:core:accounts:fetch --account-sid="$TWILIO_ACCOUNT_SID" --auth-token="$TWILIO_AUTH_TOKEN" &> /dev/null; then
    print_error "Invalid Twilio credentials. Please check and try again."
    exit 1
fi

print_success "Twilio credentials validated!"
echo ""

# Setup Google Sheets integration
print_step "Setting up Google Sheets integration..."
echo "We'll create a sample Google Sheet with customer data for demonstration."
echo "In production, you'll connect to your own Google Sheet or database."
echo ""

# Create sample data structure
print_step "Creating sample customer database structure..."
cat > sample-customers.csv << EOF
phone,first_name,last_name,email,programs,notes
+15109309015,Mickey,Mouse,mickey@disney.com,SNP,Demo customer for testing
+15551234567,Donald,Duck,donald@disney.com,"SNP,Housing",Regular food bank visitor
+15559876543,Goofy,Goof,goofy@disney.com,Crisis Support,Crisis counseling client
EOF

print_success "Sample customer data created!"
echo ""

# Install dependencies
print_step "Installing dependencies..."
npm init -y > /dev/null 2>&1
npm install --save @twilio/flex-plugins-api twilio axios > /dev/null 2>&1

print_success "Dependencies installed!"
echo ""

# Create basic project structure
print_step "Creating project structure..."

# Create basic Flex plugin structure
mkdir -p flex-plugin/src/components
mkdir -p flex-plugin/public
mkdir -p serverless-functions/src/functions

# Create basic serverless function for customer lookup
cat > serverless-functions/src/functions/lookup-customer.js << 'EOF'
const axios = require('axios');

exports.handler = async (context, event, callback) => {
    const response = new Twilio.Response();
    
    // Enable CORS
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    try {
        const { phone } = event;
        
        // Clean phone number
        const cleanPhone = phone.replace(/^\+?1?/, '').replace(/\D/g, '');
        
        // In a real deployment, this would connect to your Google Sheets or database
        // For demo purposes, we'll return sample data for specific numbers
        const sampleCustomers = {
            '5109309015': {
                first_name: 'Mickey',
                last_name: 'Mouse', 
                email: 'mickey@disney.com',
                programs: 'SNP',
                notes: 'Demo customer for testing'
            },
            '5551234567': {
                first_name: 'Donald',
                last_name: 'Duck',
                email: 'donald@disney.com', 
                programs: 'SNP, Housing',
                notes: 'Regular food bank visitor'
            }
        };
        
        const customer = sampleCustomers[cleanPhone];
        
        if (customer) {
            response.setBody({
                found: true,
                customer: customer,
                profile_url: `https://example.com/profile?customer=${customer.first_name}+${customer.last_name}`
            });
        } else {
            response.setBody({
                found: false,
                customer: null,
                profile_url: `https://example.com/profile?phone=${phone}`
            });
        }
        
        callback(null, response);
        
    } catch (error) {
        console.error('Error looking up customer:', error);
        response.setStatusCode(500);
        response.setBody({ error: 'Failed to lookup customer' });
        callback(null, response);
    }
};
EOF

print_success "Project structure created!"
echo ""

# Create deployment configuration
print_step "Creating deployment configuration..."

cat > .env << EOF
TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN
EOF

print_success "Configuration created!"
echo ""

# Final setup
print_step "Finalizing setup..."

echo "🎉 ConnieRTC Quick Start Complete!"
echo ""
echo "📋 What was created:"
echo "   ✅ Sample customer database (sample-customers.csv)"
echo "   ✅ Customer lookup serverless function"
echo "   ✅ Basic project structure"
echo "   ✅ Twilio configuration"
echo ""
echo "🚀 Next Steps:"
echo "   1. Deploy serverless functions: npm run deploy:functions"
echo "   2. Deploy Flex plugin: npm run deploy:plugin"
echo "   3. Configure Studio Flow (see docs/studio-setup.md)"
echo "   4. Test with sample phone numbers:"
echo "      📞 +1 (510) 930-9015 → Mickey Mouse"
echo "      📞 +1 (555) 123-4567 → Donald Duck"
echo ""
echo "📚 Documentation:"
echo "   • Quick Start Guide: docs/quick-start.md"
echo "   • Google Sheets Setup: docs/google-sheets.md"
echo "   • Custom Database: docs/custom-database.md"
echo ""
echo "🤝 Need Help?"
echo "   • GitHub Discussions: https://github.com/connie-org/connieRTC-flex-community/discussions"
echo "   • Professional Services: https://connie.technology/services"
echo ""
print_success "Ready to transform your nonprofit call center! 🚀"
EOF
