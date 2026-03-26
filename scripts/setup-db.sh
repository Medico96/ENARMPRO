#!/bin/bash

# ================================================================
# ENARM Pro - Database Setup Script
# ================================================================

set -e

echo "🗄️  ENARM Pro - Database Setup"
echo "=============================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Installing..."
    brew install supabase/tap/supabase
fi

echo "✓ Supabase CLI ready"

# Ask for database connection string
read -p "Enter your Supabase project URL: " SUPABASE_URL
read -p "Enter your Supabase service role key: " SERVICE_ROLE_KEY

echo ""
echo "Running migrations..."

# Run SQL migrations
for file in supabase/migrations/*.sql; do
    echo "Executing $file..."
    
    curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
      -H "apikey: ${SERVICE_ROLE_KEY}" \
      -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
      -H "Content-Type: application/json" \
      -d @"$file"
done

echo ""
echo "✓ Database setup completed!"
echo ""
echo "Next steps:"
echo "  1. Update your .env.local with the Supabase credentials"
echo "  2. Run 'npm run dev' to start development server"
