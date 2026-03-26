#!/bin/bash

# ================================================================
# ENARM Pro - Automated Deployment Script
# ================================================================

set -e  # Exit on error

echo "🏥 ENARM Pro - Deployment Automation"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running in correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

print_success "Project root detected"

# Check for required environment variables
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating from template..."
    cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_ENARM_DATE=2025-11-15T08:00:00-06:00
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
    print_warning "Please fill .env.local with your credentials"
    exit 1
fi

print_success "Environment variables file found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
print_success "Dependencies installed"

# Run type checking
echo ""
echo "🔍 Running type checks..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Type checking passed"
else
    print_error "Type checking failed"
    exit 1
fi

# Ask for deployment type
echo ""
echo "Select deployment target:"
echo "1) Vercel (Production)"
echo "2) Vercel (Preview)"
echo "3) Local build only"
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel (Production)..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            print_warning "Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        
        print_success "Vercel CLI ready"
        
        # Deploy to production
        vercel --prod
        
        print_success "Deployment to production completed!"
        print_warning "Don't forget to:"
        echo "  1. Update environment variables in Vercel dashboard"
        echo "  2. Configure custom domain if needed"
        echo "  3. Set up Stripe webhooks"
        ;;
        
    2)
        echo ""
        echo "🔍 Deploying to Vercel (Preview)..."
        
        if ! command -v vercel &> /dev/null; then
            print_warning "Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        
        vercel
        
        print_success "Preview deployment completed!"
        ;;
        
    3)
        echo ""
        echo "🏗️  Building locally..."
        npm run build
        print_success "Local build completed!"
        print_warning "Run 'npm start' to test the production build"
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
print_success "All done! 🎉"
